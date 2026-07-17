---
company: "visa"
id: "visa-takeaway"
order: 3
label: "Takeaway"
navLabel: "Takeaways"
title: "The One Pattern"
---

::: tldr
<p>🔑 Both problems had the same hidden slowdown: doing an O(n) amount of work (work that scales with the size of the list) <em>inside</em> a loop that already runs n times — that multiplies out to O(n²), way too slow for big inputs. The fix both times: swap that inner O(n) step for something that takes the same time no matter how big the list is (O(1)).</p>
:::

::: pattern Replacements to remember
<div class="comparison">
      <div class="comp-box bad">
        <div class="comp-label bad">O(n) — slow</div>
        <p>arr.reverse()</p>
        <p>loop summing 1+2+...+n</p>
        <p>arr.copy()</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">O(1) — fast</div>
        <p>flip a flag</p>
        <p>n*(n+1)/2</p>
        <p>pointer manipulation</p>
      </div>
    </div>
:::

::: remember Trigger question
<p style="font-size: 1.1rem; color: #e1e4e8; font-weight: 600;">"Am I doing something O(n) repeatedly? Can I make it O(1)?"</p>
:::

