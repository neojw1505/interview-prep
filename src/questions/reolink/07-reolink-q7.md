---
company: "reolink"
id: "reolink-q7"
order: 7
label: "Reolink — Question 7"
navLabel: "Q7 — ArrayList vs LinkedList"
title: "ArrayList vs LinkedList"
---

::: problem Asked
<p>Difference between ArrayList and LinkedList.</p>
:::

::: remember ✅ Correct (you doubted yourself)
<p>ArrayList = contiguous memory, fast random access. LinkedList = linked nodes, fast insert/remove at the ends. You had the reasoning right.</p>
:::

::: insight What they're testing
<p>Whether you know <em>why</em> the Big-O differs (memory layout, not just "array vs pointers"), and that real benchmarks don't always match the theory — a classic follow-up trap.</p>
:::

::: why The reasoning
<p>An array stores everything back-to-back in memory, so the computer can jump straight to element <code>i</code> with simple math (start address + i × size) — no searching needed, that's why it's O(1) (constant time, no matter how big the list is). A linked list has no such shortcut — each item is a separate little box scattered wherever there's free memory, connected by pointers, so finding item <code>i</code> means starting at the front and hopping one box at a time (O(n), slower as the list grows). That same "just a box with pointers" design is exactly what makes inserting in the middle cheap for a linked list — you just rewire a couple of pointers instead of shifting everything over like an array has to.</p>
    <p>In practice, ArrayList often wins anyway: the computer's CPU is much faster at reading memory that sits together in one place (it preloads nearby data automatically), while hopping between scattered linked-list boxes causes slow "cache misses" — the CPU has to go fetch each one individually. Big-O only counts the number of steps, it doesn't account for this real hardware speed difference.</p>
:::

::: why Quick reference
<div class="comparison">
      <div class="comp-box good">
        <div class="comp-label good">ArrayList</div>
        <p>get(i) — O(1)</p>
        <p>middle insert — O(n)</p>
      </div>
      <div class="comp-box bad">
        <div class="comp-label bad">LinkedList</div>
        <p>get(i) — O(n)</p>
        <p>head/tail insert — O(1)</p>
      </div>
    </div>
:::

::: tldr
<p>💡 Contiguous memory = address by math. Linked nodes = address by pointer-chasing. Big-O doesn't model cache locality, which is why the "faster" one on paper often isn't in practice.</p>
:::

