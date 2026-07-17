function toggleCompany(el) {
  const links = el.nextElementSibling;
  links.classList.toggle('collapsed');
  el.classList.toggle('collapsed');
}

// Every question/round/takeaway section on this page shares one id-anchor
// pattern, used by scroll-highlighting, answer-reveal, and mastery tracking.
const idPattern = /^(visa|tiktok|foodpanda|rakuten|viki|bytedance|shopee|okx|reolink)-/;
const qAnchors = Array.from(document.querySelectorAll('.container [id]')).filter(el => idPattern.test(el.id));

// GitHub Pages project sites are served under /<repo-name>/, so every
// absolute path this script builds itself has to go through this prefix
// (base.njk sets it to match Eleventy's own pathPrefix).
const SITE_PREFIX = window.SITE_PREFIX || '/';
const currentCompanySlug = location.pathname.replace(SITE_PREFIX, '').split('/').filter(Boolean)[0] || null;

// Highlight active sidebar link on scroll
const sections = qAnchors;
const links = document.querySelectorAll('.question-link');

function updateActive() {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) current = section.id;
  });
  links.forEach(link => {
    link.classList.remove('active');
    if (new URL(link.href, location.href).hash === '#' + current) {
      link.classList.add('active');
    }
  });
}

document.querySelector('.main-content').addEventListener('scroll', updateActive);
window.addEventListener('scroll', updateActive);
updateActive();

// Sidebar links: smooth-scroll when the target is on this page, otherwise
// let the browser navigate to the other company's page normally.
links.forEach(link => {
  link.addEventListener('click', e => {
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname) return;
    e.preventDefault();
    const target = document.querySelector(url.hash);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ==================== Answer Reveal + Mastery Tracking ====================
(function () {
  const RATING_KEY = 'interviewBank_ratings_v1';
  let ratings = {};
  try { ratings = JSON.parse(localStorage.getItem(RATING_KEY) || '{}'); } catch (e) { ratings = {}; }

  function saveRatings() {
    try { localStorage.setItem(RATING_KEY, JSON.stringify(ratings)); } catch (e) {}
  }

  function ratingColor(r) {
    return r === 'nailed' ? '#34d399' : r === 'shaky' ? '#fbbf24' : r === 'blank' ? '#f87171' : '#374151';
  }

  // A "problem" card is the question/statement itself (including worked
  // examples, which reuse the same card-title class) — that must stay
  // visible, since you can't attempt a problem you can't read. Only the
  // solution content (steps, code, theory answers, etc.) gets hidden
  // behind "Show Answer".
  function isProblemCard(n) {
    if (!n.classList || !n.classList.contains('card')) return false;
    const title = n.firstElementChild;
    return !!(title && title.classList && title.classList.contains('card-title') && title.classList.contains('problem'));
  }

  const ratableAnchors = [];

  qAnchors.forEach((anchor, i) => {
    const h2 = anchor.nextElementSibling;
    if (!h2 || h2.tagName !== 'H2') return;

    const next = qAnchors[i + 1] || null;
    const allNodes = [];
    let node = h2.nextElementSibling;
    while (node && node !== next) {
      allNodes.push(node);
      node = node.nextElementSibling;
    }
    if (!allNodes.length) return;

    // Keep the leading run of problem/example cards visible; only wrap
    // what comes after. If a section has no problem card at all, leave it
    // fully visible — there's nothing safe to hide.
    let splitIdx = 0;
    while (splitIdx < allNodes.length && isProblemCard(allNodes[splitIdx])) splitIdx++;
    if (splitIdx === 0) return;

    const answerNodes = allNodes.slice(splitIdx);
    if (!answerNodes.length) return;

    // Keep a trailing divider (if any) outside the collapsible block so
    // spacing between sections stays consistent whether expanded or not.
    let trailingHr = null;
    if (answerNodes[answerNodes.length - 1].tagName === 'HR') trailingHr = answerNodes.pop();
    if (!answerNodes.length) return;

    const lastVisible = allNodes[splitIdx - 1];

    const wrap = document.createElement('div');
    wrap.className = 'answer-wrap collapsed';
    answerNodes.forEach(n => wrap.appendChild(n));

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reveal-btn';
    btn.textContent = '▸ Show Answer';
    btn.addEventListener('click', () => {
      const collapsed = wrap.classList.toggle('collapsed');
      btn.textContent = collapsed ? '▸ Show Answer' : '▾ Hide Answer';
    });

    const ratingBar = document.createElement('div');
    ratingBar.className = 'rating-bar';
    [['blank', '😬 Blanked'], ['shaky', '😐 Shaky'], ['nailed', '😎 Nailed it']].forEach(([key, label]) => {
      const rb = document.createElement('button');
      rb.type = 'button';
      rb.className = 'rating-btn';
      rb.dataset.rating = key;
      rb.textContent = label;
      if (ratings[anchor.id] === key) rb.classList.add('active');
      rb.addEventListener('click', () => {
        ratings[anchor.id] = ratings[anchor.id] === key ? null : key;
        if (!ratings[anchor.id]) delete ratings[anchor.id];
        saveRatings();
        ratingBar.querySelectorAll('.rating-btn').forEach(x => x.classList.remove('active'));
        if (ratings[anchor.id]) rb.classList.add('active');
        updateSidebarDots();
        updateProgressSummary();
      });
      ratingBar.appendChild(rb);
    });

    lastVisible.insertAdjacentElement('afterend', ratingBar);
    lastVisible.insertAdjacentElement('afterend', wrap);
    lastVisible.insertAdjacentElement('afterend', btn);

    if (trailingHr) ratingBar.insertAdjacentElement('afterend', trailingHr);

    ratableAnchors.push(anchor);
  });

  function updateSidebarDots() {
    document.querySelectorAll('.question-link').forEach(link => {
      const id = new URL(link.href, location.href).hash.slice(1);
      let dot = link.querySelector('.q-dot');
      if (!dot) {
        dot = document.createElement('span');
        dot.className = 'q-dot';
        link.insertBefore(dot, link.firstChild);
      }
      dot.style.background = ratingColor(ratings[id]);
    });
  }

  // Scoped to this page's questions (i.e. per company) rather than
  // site-wide, since each company now lives on its own page.
  function updateProgressSummary() {
    const box = document.getElementById('progressSummary');
    if (!box) return;
    const total = ratableAnchors.length;
    if (!total) { box.innerHTML = ''; return; }
    const reviewed = ratableAnchors.filter(a => ratings[a.id]).length;
    const nailed = ratableAnchors.filter(a => ratings[a.id] === 'nailed').length;
    const pct = total ? Math.round((nailed / total) * 100) : 0;
    box.innerHTML =
      '<div class="progress-label"><span>' + nailed + '/' + total + ' mastered</span><span>' + reviewed + '/' + total + ' reviewed</span></div>' +
      '<div class="progress-bar-track"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';
  }

  updateSidebarDots();
  updateProgressSummary();
})();

// ==================== Smart Search ====================
(function () {
  const searchBox = document.getElementById('searchBox');
  const resultsBox = document.getElementById('searchResults');
  const kbdHint = document.getElementById('searchKbd');
  const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform || navigator.userAgent);
  kbdHint.textContent = isMac ? '⌘K' : 'Ctrl+K';

  // Site-wide index, built at Eleventy build time (search spans every
  // company, not just the one on this page).
  let index = [];
  fetch(SITE_PREFIX + 'search-index.json').then(r => r.json()).then(data => { index = data; }).catch(() => {});

  // Fuzzy score, word by word — same idea as IntelliJ's "Search Everywhere":
  // each word in the query must match somewhere in the target (as a
  // substring, or as an in-order/typo-tolerant subsequence). Any word that
  // doesn't match at all zeroes out the whole result, which keeps
  // multi-word searches from drowning in unrelated noise matches.
  function tokenScore(word, target) {
    if (word.length < 2) return target.includes(word) ? 20 : 0;

    const idx = target.indexOf(word);
    if (idx !== -1) return 100 - Math.min(idx, 50);

    // Try every occurrence of the word's first letter as a possible
    // start, and keep the tightest (smallest-span) subsequence match.
    // A single greedy pass from position 0 can accidentally anchor on
    // an unrelated early letter and make a real match look "spread out".
    let bestSpan = Infinity;
    for (let start = 0; start < target.length; start++) {
      if (target[start] !== word[0]) continue;
      let ti = start + 1, matched = 1;
      for (let i = 1; i < word.length; i++) {
        const ch = word[i];
        let found = false;
        while (ti < target.length) {
          if (target[ti] === ch) { found = true; ti++; break; }
          ti++;
        }
        if (found) matched++; else break;
      }
      if (matched === word.length) {
        const span = ti - start;
        if (span < bestSpan) bestSpan = span;
      }
    }
    if (bestSpan === Infinity) return 0;

    // Reject overly loose subsequence matches — a real fuzzy/typo match
    // should stay tight; wide-spread letters across a long paragraph are
    // just noise, not a match.
    const slack = bestSpan - word.length;
    if (slack > Math.max(3, Math.floor(word.length * 0.6))) return 0;
    return Math.max(10, 40 - slack);
  }

  function fuzzyScore(query, target) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    let total = 0;
    for (const w of words) {
      const s = tokenScore(w, target);
      if (s === 0) return 0;
      total += s;
    }
    return total;
  }

  function scoreItem(query, item) {
    const titleScore = fuzzyScore(query, item.title + ' ' + item.label + ' ' + item.company) * 4;
    const bodyScore = fuzzyScore(query, item.haystack);
    return titleScore + bodyScore;
  }

  let currentResults = [];
  let activeIndex = -1;

  function render(results, query) {
    currentResults = results;
    activeIndex = results.length ? 0 : -1;
    if (!results.length) {
      resultsBox.innerHTML = query ? '<div class="search-empty">No matches</div>' : '';
      resultsBox.classList.toggle('open', !!query);
      return;
    }
    resultsBox.innerHTML = results.map((r, i) => `
      <div class="search-result-item${i === 0 ? ' active' : ''}" data-id="${r.id}">
        <div class="sr-title">${r.title}</div>
        <div class="sr-sub">${r.company}</div>
      </div>
    `).join('');
    resultsBox.classList.add('open');
    attachResultHandlers();
  }

  function attachResultHandlers() {
    resultsBox.querySelectorAll('.search-result-item').forEach((el, i) => {
      el.addEventListener('mouseenter', () => setActive(i));
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        jumpTo(el.getAttribute('data-id'));
      });
    });
  }

  function setActive(i) {
    activeIndex = i;
    resultsBox.querySelectorAll('.search-result-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
  }

  function jumpTo(id) {
    resultsBox.classList.remove('open');
    searchBox.value = '';
    searchBox.blur();
    const item = index.find(x => x.id === id);
    if (!item) return;
    if (item.companySlug === currentCompanySlug) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      location.href = SITE_PREFIX + item.companySlug + '/#' + id;
    }
  }

  function runSearch() {
    const query = searchBox.value.trim();
    if (!query) { render([], ''); return; }
    const scored = index
      .map(item => ({ item, score: scoreItem(query, item) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(x => x.item);
    render(scored, query);
  }

  searchBox.addEventListener('input', runSearch);

  searchBox.addEventListener('keydown', (e) => {
    if (!resultsBox.classList.contains('open')) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, currentResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && currentResults[activeIndex]) jumpTo(currentResults[activeIndex].id);
    } else if (e.key === 'Escape') {
      resultsBox.classList.remove('open');
      searchBox.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) resultsBox.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchBox.focus();
      searchBox.select();
    }
  });
})();
