// One-off migration: converts the hand-written Interview_questions.html
// into src/questions/<company>/<id>.md files + src/_data/companies.json.
//
// Strategy: every element with an id matching COMPANY_PATTERN is an anchor
// (a "question", "round" banner, or "takeaway" section — the original app
// treats them identically for nav/search/rating purposes, so we do too).
// Content between one anchor and the next becomes that anchor's markdown
// body. Card divs (.card / .tldr) become `::: type Title ... :::`
// containers; everything else inside a card passes through as raw HTML
// unchanged (the CSS classes it references are being carried over as-is),
// EXCEPT <pre><code> blocks, which get flattened to plain text and
// re-wrapped as fenced code blocks so the new build-time syntax
// highlighter can take over from the old hand-written <span> markup.

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SOURCE = process.argv[2] || path.join(process.env.HOME, "Downloads/Interview_questions.html");
const OUT_QUESTIONS = path.join(__dirname, "../src/questions");
const OUT_DATA = path.join(__dirname, "../src/_data/companies.json");

const COMPANY_SLUGS = ["visa", "tiktok", "foodpanda", "rakuten", "viki", "bytedance", "shopee", "okx", "reolink"];
const ANCHOR_RE = new RegExp(`^(${COMPANY_SLUGS.join("|")})-`);
const CARD_TYPES = ["problem", "insight", "steps", "code", "why", "remember", "pattern"];

const html = fs.readFileSync(SOURCE, "utf8");
const $ = cheerio.load(html);

// ---------- 1. Sidebar -> companies.json ----------

const companies = {};
$(".company-group").each((order, group) => {
  const $group = $(group);
  const $name = $group.find(".company-name");
  const $logo = $name.find(".company-logo");
  const $badge = $name.find(".company-badge");

  const style = $logo.attr("style") || "";
  const bg = (style.match(/background:\s*([^;]+)/) || [])[1] || "#1e2130";
  const color = (style.match(/color:\s*([^;]+)/) || [])[1] || "#fff";

  const displayName = $name
    .clone()
    .find(".company-logo, .company-badge, .company-chevron")
    .remove()
    .end()
    .text()
    .trim();

  const firstHref = $group.find(".question-link").first().attr("href") || "";
  const slug = firstHref.replace("#", "").match(ANCHOR_RE)?.[1];
  if (!slug) return;

  companies[slug] = {
    name: displayName,
    logoText: $logo.text().trim(),
    logoBg: bg.trim(),
    logoColor: color.trim(),
    badge: $badge.text().trim(),
    order,
  };
});

fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });
fs.writeFileSync(OUT_DATA, JSON.stringify(companies, null, 2) + "\n");
console.log(`Wrote ${Object.keys(companies).length} companies to ${OUT_DATA}`);

// ---------- 2. Body -> per-question markdown ----------

function detectLang(text) {
  if (/\bpublic\s+(class|static)\b|@\w+\s*\n|;\s*$/m.test(text)) return "java";
  if (/\bdef\s+\w+\(|\breturn\b|\bself\b|\belif\b/.test(text)) return "python";
  return "";
}

function fence(text, lang) {
  const body = text.replace(/\s+$/, "");
  return "```" + lang + "\n" + body + "\n```";
}

function cardInnerMarkdown($card, isCodeCard) {
  const $clone = $card.clone();
  $clone.children(".card-title").remove();

  // Fenced code text must stay untouched by HTML serialization (it's about
  // to go through cheerio's .html(), which would re-escape a literal "<" in
  // e.g. "while left <= right:" into "&lt;", corrupting the code). Swap in a
  // plain placeholder token instead, then splice the real fence back in via
  // string replace *after* serialization.
  const fences = [];
  $clone.find("pre").each((i, pre) => {
    const $pre = $(pre);
    const codeText = $pre.find("code").first().text();
    const lang = isCodeCard ? "python" : detectLang(codeText);
    fences.push(fence(codeText, lang));
    $pre.replaceWith(`@@FENCE_${i}@@`);
  });

  let out = $clone.html().trim();
  fences.forEach((f, i) => {
    out = out.split(`@@FENCE_${i}@@`).join("\n\n" + f + "\n\n");
  });
  return out;
}

function renderNode(node) {
  const $node = $(node);
  if ($node.hasClass("card")) {
    const $title = $node.children(".card-title").first();
    const classes = ($title.attr("class") || "").split(/\s+/);
    const type = CARD_TYPES.find((t) => classes.includes(t)) || "problem";
    const titleText = $title.text().trim();
    const body = cardInnerMarkdown($node, type === "code");
    return `::: ${type} ${titleText}\n${body}\n:::\n`;
  }
  if ($node.hasClass("tldr")) {
    const $clone = $node.clone();
    return `::: tldr\n${$clone.html().trim()}\n:::\n`;
  }
  if ($node.is("hr")) return ""; // dividers are re-added by the template between questions
  // Fallback: anything else passes through untouched.
  return $.html(node) + "\n";
}

const container = $(".container");
const children = container.children().toArray();

const anchors = [];
let current = null;

for (const el of children) {
  const $el = $(el);
  const id = $el.attr("id");
  if (id && ANCHOR_RE.test(id)) {
    current = {
      id,
      company: id.match(ANCHOR_RE)[1],
      label: $el.text().trim(),
      labelStyle: $el.attr("style") || "",
      title: null,
      nodes: [],
      consumedH2: false,
    };
    anchors.push(current);
    continue;
  }
  if (!current) continue; // content before the first anchor (h1/subtitle) — skip
  if (!current.consumedH2 && $el.is("h2")) {
    current.title = $el.text().trim();
    current.consumedH2 = true;
    continue;
  }
  current.nodes.push(el);
}

// nav labels, in sidebar order, keyed by id
const navLabels = {};
$(".question-link").each((_, a) => {
  const id = ($(a).attr("href") || "").replace("#", "");
  navLabels[id] = $(a).text().trim();
});

const perCompanyOrder = {};
let written = 0;

for (const a of anchors) {
  const order = (perCompanyOrder[a.company] = (perCompanyOrder[a.company] || 0) + 1);
  const body = a.nodes.map(renderNode).filter(Boolean).join("\n");

  const front = {
    company: a.company,
    id: a.id,
    order,
    label: a.label,
    ...(a.labelStyle ? { labelStyle: a.labelStyle } : {}),
    navLabel: navLabels[a.id] || a.label,
    title: a.title || a.label,
  };

  const yaml = Object.entries(front)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const dir = path.join(OUT_QUESTIONS, a.company);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${String(order).padStart(2, "0")}-${a.id}.md`;
  fs.writeFileSync(path.join(dir, filename), `---\n${yaml}\n---\n\n${body}\n`);
  written++;
}

console.log(`Wrote ${written} question files across ${Object.keys(perCompanyOrder).length} companies.`);
