# Interview Prep

Personal reference of real interview questions from actual assessments, organized by company.

**Live site:** https://neojw1505.github.io/interview-prep/

## What this is

A static site: each company gets its own page with the questions asked, the problem, worked examples, the solution, and why it works. Includes answer-reveal, a self-rating system ("blanked" / "shaky" / "nailed it") tracked in your browser, and cross-company search.

## How it's built

- **[Eleventy (11ty)](https://www.11ty.dev/)** — static site generator. Compiles Markdown + templates into plain HTML at build time; nothing runs on a server.
- **Markdown** — each question is one `.md` file in `src/questions/<company>/`. Front matter holds metadata (company, title, nav label); the body holds the content.
- **Nunjucks** (`.njk`) — templates. `src/company.njk` generates all 9 company pages from one template + the question data. `src/_includes/` holds the shared layout and sidebar.
- **Prism** (via `@11ty/eleventy-plugin-syntaxhighlight`) — syntax highlighting, applied at build time.
- **Vanilla JS** (`src/assets/app.js`) — the only things that run in the browser: rating clicks (saved to `localStorage`), search, sidebar toggling.
- **GitHub Actions** (`.github/workflows/deploy.yml`) — on every push to `main`, builds the site and deploys it to GitHub Pages. No manual deploy step.

## Adding a new question

1. Look at any existing file in `src/questions/<company>/` (e.g. `src/questions/visa/01-visa-q1.md`) as a template.
2. Create a new `.md` file in the right company folder (or a new folder + an entry in `src/_data/companies.json` for a brand-new company).
3. Fill in the front matter and write the content using the card containers already in use:
   ```
   ::: problem Problem
   What was asked.
   :::

   ::: code
   ```python
   def solve():
       ...
   ```
   :::
   ```
   Other container types: `insight`, `steps`, `why`, `remember`, `pattern`, plus `tldr` (no title).
4. Push to `main` — the site rebuilds and redeploys automatically.

## Local development

```
npm install
npm start        # dev server at localhost:8080, live reload
npm run build     # one-off build to _site/
```

## Project structure

```
src/
  questions/<company>/*.md   # question content — this is what you'll edit most
  _data/companies.json        # per-company display name, logo, badge, color
  _includes/layouts/base.njk  # shared page shell (head, sidebar, scripts)
  _includes/partials/sidebar.njk
  company.njk                 # one template -> one page per company
  index.njk                   # homepage
  search-index.11ty.js        # generates search-index.json at build time
  assets/style.css, app.js
scripts/migrate.js             # one-off script that did the original HTML -> Markdown migration
.github/workflows/deploy.yml   # build + deploy on push
```
