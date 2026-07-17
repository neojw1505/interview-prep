---
company: "viki"
id: "viki-q1"
order: 1
label: "Rakuten Viki — Live Coding Q1"
labelStyle: "background:#2d1a3a; color:#c084fc;"
navLabel: "Q1 — Int to Binary String"
title: "Integer to Binary String"
---

::: problem Problem
<p>Given a non-negative integer, return its <span class="highlight">binary representation as a string</span> without using any built-in binary conversion functions.</p>
:::

::: problem Examples


```
5  → "101"
8  → "1000"
0  → "0"
```


:::

::: tldr
<p>💡 Divide by 2, prepend the remainder each time. Remainder is always 0 or 1.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>While n &gt; 0: remainder = n % 2, prepend to result, n = n // 2</li>
      <li>Edge case: if n == 0, return "0"</li>
    </ol>
:::

::: code Final code


```python
def solution(n):
    if n == 0:
        return "0"

    result = ""
    while n > 0:
        result = str(n % 2) + result  # prepend remainder
        n = n // 2

    return result
```


:::

