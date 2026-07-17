---
company: "rakuten"
id: "rakuten-q3"
order: 3
label: "Rakuten — Task 3"
labelStyle: "background:#1a2e1a; color:#4ade80;"
navLabel: "Q3 — Min Cost Chain Split"
title: "Minimum Cost Chain Split"
---

::: problem Problem
<p>Array A of N integers represents a chain. Break it at exactly two non-adjacent positions P and Q (0 &lt; P &lt; Q &lt; N-1, Q-P &gt; 1). Cost = <span class="highlight">A[P] + A[Q]</span>. Return the minimum cost.</p>
:::

::: problem Example


```
A = [5, 2, 4, 6, 3, 7]

(1,3): cost = A[1]+A[3] = 2+6 = 8
(1,4): cost = A[1]+A[4] = 2+3 = 5  ← minimum
(2,4): cost = A[2]+A[4] = 4+3 = 7
```


:::

::: tldr
<p>💡 Precompute suffix minimum so each P lookup is O(1). Total O(n) instead of O(n²).</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Build <code>suffix_min[i]</code> = minimum of A[i..n-1]</li>
      <li>For each valid P (1 to n-3): cost = A[P] + suffix_min[P+2]</li>
      <li>Return the minimum cost found</li>
    </ol>
:::

::: code Final code


```python
def solution(A):
    n = len(A)

    # suffix_min[i] = min value from index i to end
    suffix_min = [0] * n
    suffix_min[n - 1] = A[n - 1]
    for i in range(n - 2, 0, -1):
        suffix_min[i] = min(A[i], suffix_min[i + 1])

    best = float('inf')
    for p in range(1, n - 2):
        # Q must be at least P+2
        best = min(best, A[p] + suffix_min[p + 2])

    return best
```


:::

::: remember Constraint check
<p>P ranges from 1 to n-3 (needs room for Q at P+2 up to n-1). Q ranges from P+2 to n-1. The suffix min handles finding the best Q for each P in O(1).</p>
:::

