---
company: "viki"
id: "viki-q2"
order: 2
label: "Rakuten Viki — Live Coding Q2"
labelStyle: "background:#2d1a3a; color:#c084fc;"
navLabel: "Q2 — Largest AND Group"
title: "Largest Group with Bitwise AND > 0"
---

::: problem Problem
<p>Given an array of positive integers, find the <span class="highlight">largest group</span> of numbers whose bitwise AND is greater than 0. Return the maximum size of such a group.</p>
:::

::: problem Example


```
[1, 5, 3] → AND = 1 & 5 & 3 = 1 > 0
[7]       → AND = 7 > 0
```


:::

::: tldr
<p>💡 AND &gt; 0 means at least one bit is 1 in ALL numbers. Find which bit position is shared by the most numbers — that count is your answer.</p>
:::

::: insight Key Insight
<div class="comparison">
      <div class="comp-box bad">
        <div class="comp-label bad">Wrong approach</div>
        <p>Try all subsets — O(2ⁿ)</p>
        <p>Way too slow</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">Right approach</div>
        <p>For each bit position, count numbers that have it set</p>
        <p>Max count = answer — O(30n)</p>
      </div>
    </div>
    <p style="margin-top:12px;">If numbers share bit position X, their AND has bit X set → AND &gt; 0. The most numbers sharing any single bit = largest valid group.</p>
:::

::: code Final code


```python
def solution(nums):
    best = 0

    for bit in range(30):  # check each bit position 0–29
        count = 0
        for num in nums:
            if num & (1 << bit):
                count += 1
        best = max(best, count)

    return best
```


:::

::: remember Why 30 bits?
<p>Positive integers up to ~10⁹ fit in 30 bits (2³⁰ ≈ 1 billion). Safe upper bound for any typical interview constraint.</p>
:::

