---
company: "reolink"
id: "reolink-q8"
order: 8
label: "Reolink — Question 8"
navLabel: "Q8 — Thread Pools"
title: "Thread Pools"
---

::: problem Asked
<p>Have you heard of / used thread pools before?</p>
:::

::: insight What they're testing
<p>Whether you connect this back to the earlier thread-vs-process point: threads are <em>cheaper</em> than processes to create, but not <em>free</em>. They want to know if you understand why that "not free" part matters at scale, not just that thread pools exist.</p>
:::

::: why The reasoning
<p>Creating a thread has real overhead — the OS allocates a stack, registers it with the scheduler, and later has to tear it all down. Cheap once, but if you spin up a brand-new thread for every incoming task (e.g. one thread per request), under load you're creating and destroying thousands of threads, and that overhead — plus the scheduler fighting to context-switch between way too many live threads at once — starts to dominate and actually slow things down.</p>
    <p>A thread pool fixes this by creating a <span class="highlight">fixed number of worker threads up front</span>, keeping them alive, and reusing them to run a queue of submitted tasks. Two wins at once: you stop paying the create/destroy cost per task, and you cap how many threads ever run at the same time — so memory and CPU use stay predictable instead of growing unbounded under a traffic spike.</p>
:::

::: code Example (Java)
```java
ExecutorService pool = Executors.newFixedThreadPool(4);

for (int i = 0; i < 100; i++) {
    pool.submit(() -> handleRequest());
}

pool.shutdown();
```
:::

::: remember Don't forget
<p>100 tasks submitted above, but only 4 threads ever get created — the rest queue up and get reused threads as they free up. If a follow-up digs deeper: <span class="highlight">core pool size</span> (threads kept alive even when idle) vs <span class="highlight">max pool size</span> (the ceiling under load), the <span class="highlight">task queue</span> (where work waits when every thread is busy), and the <span class="highlight">rejection policy</span> (what happens if the queue itself fills up too).</p>
:::

::: tldr
<p>💡 Same trade-off as thread vs process, one level up: don't pay a creation cost more often than you have to. A thread pool trades "new thread per task" (expensive, unbounded) for "reuse a fixed set of threads, queue the rest" (cheap, bounded).</p>
:::
