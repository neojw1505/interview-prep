---
company: "reolink"
id: "reolink-q4"
order: 4
label: "Reolink — Question 4"
navLabel: "Q4 — MongoDB vs MySQL"
title: "MongoDB vs MySQL"
---

::: problem Asked
<p>What data each stores, and the core difference.</p>
:::

::: remember ✅ Correct
<p>MongoDB is schema-less — fields can be added/changed anytime. MySQL needs a fixed schema — a new field means a migration. Good baseline; the reasoning below is what an interviewer is actually checking for.</p>
:::

::: insight What they're testing
<p>Whether you understand the modeling trade-off (joins vs embedding) — not just "one has schema, one doesn't."</p>
:::

::: why The reasoning
<p>MySQL assumes your data has fixed relationships (a user has orders, orders have items), keeps them in separate tables, and stitches them back together at query time with a <code>JOIN</code> — strong guarantees, but that stitching costs time on every read. MongoDB assumes you'll usually want related data together anyway, so it just stores it together in one document and skips the join entirely — faster reads, but now it's your job to keep the same info consistent if it's duplicated in multiple places.</p>
    <p>This is also why MongoDB is easier to <span class="highlight">scale across many servers</span> (called sharding — splitting data across machines so no single server has to hold everything): since related data already lives in one document, splitting documents across servers never breaks a query. MySQL has a harder time with this because a join might need data sitting on two different servers. Worth knowing: MongoDB added proper multi-document transactions (guaranteed all-or-nothing updates, like MySQL's) back in 2018 — saying "Mongo has no transactions" is outdated.</p>
:::

::: why Quick reference
<div class="comparison">
      <div class="comp-box good">
        <div class="comp-label good">MySQL</div>
        <p>Fixed schema, joins across tables</p>
        <p>Strong ACID by default</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">MongoDB</div>
        <p>Flexible schema, embeds related data</p>
        <p>Built-in horizontal sharding</p>
      </div>
    </div>
:::

