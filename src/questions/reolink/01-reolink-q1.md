---
company: "reolink"
id: "reolink-q1"
order: 1
label: "Reolink — Hiring Manager Interview"
labelStyle: "background:#0a2a4d; color:#5eb3f5;"
navLabel: "Q1 — Thread vs Process"
title: "Thread vs Process"
---

::: problem Asked
<p>Standard OS question — thread vs process. No issues here.</p>
:::

::: insight What they're testing
<p>Whether you understand isolation vs shared memory at the OS level — not just able to recite "process = own memory, thread = shared memory" as memorized labels.</p>
:::

::: why The reasoning
<p>A process gets its own private chunk of memory (the CPU keeps a lookup table mapping that process's memory addresses to real physical memory), so one program literally can't reach into another's memory even by accident. That protection is also <em>why</em> switching between processes is slow — the CPU has to swap out that whole lookup table for the next process. A thread skips that cost because it shares its process's memory — switching threads just means swapping a few CPU registers, which is cheap. But sharing memory means two threads can read/write the same bytes at the same time and step on each other, which is why you need locks to take turns safely. Same trade-off either way: isolation costs speed, sharing costs safety.</p>
    <p><span class="highlight">Follow-up trap:</span> Python has something called the GIL (Global Interpreter Lock) — it only lets one thread run Python code at a time, in the whole program. It exists because Python's memory cleanup isn't safe for multiple threads to touch at once, so instead of protecting every little piece individually, Python just uses one big lock for everything. That's why using threads in Python doesn't actually speed up CPU-heavy work — only one is ever really running.</p>
:::

::: why Quick reference
<div class="comparison">
      <div class="comp-box bad">
        <div class="comp-label bad">Process</div>
        <p>Own memory space</p>
        <p>Heavier to create/switch</p>
        <p>Crash doesn't affect other processes</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">Thread</div>
        <p>Shares memory with sibling threads</p>
        <p>Cheaper to create/switch</p>
        <p>Crash can take down the whole process</p>
      </div>
    </div>
:::

::: tldr
<p>💡 Isolation costs speed. Sharing costs safety. Process picks the first, thread picks the second.</p>
:::

