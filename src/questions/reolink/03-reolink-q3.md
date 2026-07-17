---
company: "reolink"
id: "reolink-q3"
order: 3
label: "Reolink — Question 3"
navLabel: "Q3 — MySQL InnoDB & Index"
title: "MySQL — InnoDB & Index"
---

::: problem Asked
<p>Whether you know InnoDB and indexing. Didn't know either.</p>
:::

::: insight What they're testing
<p>Whether you understand <em>why</em> a database needs a storage engine and an index at all — not just able to name them.</p>
:::

::: why The reasoning
<p>InnoDB solves two hard problems. First: don't corrupt data if the database crashes mid-write — it keeps a running log of every change, so after a crash it can replay or undo to get back to a safe state. Second: don't make people wait to read data just because someone else is writing to it — instead of locking a row while it's being changed, InnoDB quietly keeps the older version around too, so a reader can see a consistent snapshot while a writer is still working (this trick is called MVCC). Locking just the row being changed (not the whole table) follows the same goal — MySQL's older engine, MyISAM, locks the whole table instead, which grinds everything to a halt when lots of people are using it at once.</p>
    <p>An index speeds up lookups, and it's built as a <span class="highlight">B+Tree</span> — a tree structure that's wide and shallow on purpose. Why? Because reading from disk is the slow part, not comparing numbers, so you want to reach any row in as few "hops" as possible — a few hops can cover billions of rows. The table's primary key IS this tree (that's called the clustered index — the actual row data lives inside it). Any other index you add is a separate, smaller tree that just points back to the primary key, meaning looking something up through it takes one extra hop — which is exactly why adding more indexes makes writes slower (every index has to be updated too). You can check whether MySQL is actually using an index for a query by running <code>EXPLAIN</code> in front of it.</p>
:::

::: why InnoDB vs MyISAM
<div class="comparison">
      <div class="comp-box good">
        <div class="comp-label good">InnoDB</div>
        <p>Row-level locking</p>
        <p>Transactions + crash recovery</p>
      </div>
      <div class="comp-box bad">
        <div class="comp-label bad">MyISAM</div>
        <p>Table-level locking</p>
        <p>No transactions, no foreign keys</p>
      </div>
    </div>
:::

::: tldr
<p>💡 InnoDB solves "don't corrupt on crash, don't block readers on writers." The index solves "don't touch disk more than necessary."</p>
:::

