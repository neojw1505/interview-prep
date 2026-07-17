---
company: "rakuten"
id: "rakuten-q1"
order: 1
label: "Rakuten — OA Codility"
labelStyle: "background:#1a2e1a; color:#4ade80;"
navLabel: "Q1 — Digit Pair Matching"
title: "Digit Pair Matching"
---

::: problem Problem
<p>Given array <code>nums</code> of integers (each at least 2 digits, first ≠ last digit). Count pairs (i, j) where i ≠ j and the <span class="highlight">last digit of nums[i] equals the first digit of nums[j]</span>. Same pair of values can appear multiple times if indices differ.</p>
:::

::: problem Examples


```
[30, 12, 29, 91] → 3 pairs: (12,29), (29,91), (91,12)
[122, 21, 21, 23] → 5 pairs
```


:::

::: tldr
<p>💡 Don't check every pair O(n²). Count frequency of end digits and start digits, then multiply.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>For each number, record its first digit in <code>starts[]</code> and last digit in <code>ends[]</code></li>
      <li>For each digit 0–9: <code>count += ends[digit] * starts[digit]</code></li>
      <li>Return count — O(n) total</li>
    </ol>
:::

::: code Final code


```python
def solution(nums):
    starts = {}
    ends = {}

    for num in nums:
        s = str(num)
        first = int(s[0])
        last = int(s[-1])
        starts[first] = starts.get(first, 0) + 1
        ends[last] = ends.get(last, 0) + 1

    count = 0
    for digit in range(10):
        count += ends.get(digit, 0) * starts.get(digit, 0)

    return count
```


:::

::: remember Why this works
<p>Every number ending in digit X can pair with every number starting with digit X. Multiply their counts instead of iterating all combinations. Same logic as "count pairs with matching property" problems.</p>
:::

