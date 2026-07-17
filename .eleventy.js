const markdownItContainer = require("markdown-it-container");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Card types that map 1:1 onto the .card / .card-title <type> markup from
// the original hand-written HTML. Anything not in this list (formula boxes,
// comparison grids, arrow-flow) is rare enough that question content just
// embeds raw HTML for it directly instead of inventing more container syntax.
const CARD_TYPES = ["problem", "insight", "steps", "code", "why", "remember", "pattern"];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.amendLibrary("md", (mdLib) => {
    // Every card carries its own title as free text after the container
    // name (e.g. `::: problem Example 1`) because the original doc reuses
    // the same card type with wildly different titles per question
    // ("Problem", "Example 1", "Asked", "Theory Q3 — ...", etc).
    CARD_TYPES.forEach((type) => {
      mdLib.use(markdownItContainer, type, {
        validate(params) {
          return params.trim().split(/\s+/, 1)[0] === type;
        },
        render(tokens, idx) {
          if (tokens[idx].nesting !== 1) return `</div>\n`;
          const title = tokens[idx].info.trim().slice(type.length).trim() || cardTitle(type);
          return `<div class="card"><div class="card-title ${type}">${escapeHtml(title)}</div>\n`;
        },
      });
    });

    mdLib.use(markdownItContainer, "tldr", {
      render(tokens, idx) {
        return tokens[idx].nesting === 1 ? `<div class="tldr">\n` : `</div>\n`;
      },
    });
  });

  eleventyConfig.addCollection("companies", (collectionApi) => {
    const byCompany = {};
    collectionApi.getFilteredByGlob("src/questions/**/*.md").forEach((item) => {
      const slug = item.data.company;
      if (!byCompany[slug]) byCompany[slug] = [];
      byCompany[slug].push(item);
    });
    Object.values(byCompany).forEach((items) =>
      items.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
    );

    const companiesData = require("./src/_data/companies.json");
    return Object.keys(companiesData)
      .sort((a, b) => companiesData[a].order - companiesData[b].order)
      .map((slug) => ({ slug, meta: companiesData[slug], questions: byCompany[slug] || [] }));
  });

  return {
    // GitHub Pages project sites are served under /<repo-name>/, not the
    // domain root — every absolute link/asset path must go through the
    // `url` filter (or window.SITE_PREFIX in app.js) so it resolves there.
    pathPrefix: "/interview-prep/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};

function cardTitle(type) {
  const titles = {
    problem: "Problem",
    insight: "Insight",
    steps: "How to solve",
    code: "Final code",
    why: "Why it works",
    remember: "Don't forget",
    pattern: "Pattern",
  };
  return titles[type] || type;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
