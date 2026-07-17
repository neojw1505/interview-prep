---
company: "shopee"
id: "shopee-r1-q1"
order: 1
label: "Shopee — Live Coding Round 1"
labelStyle: "background:#2d1a1a; color:#f87171;"
navLabel: "R1 — Merge Intervals"
title: "Merge Intervals (LC 56)"
---

::: problem Problem
<p>Given an array of intervals, merge all overlapping intervals and return the result.</p>
:::

::: problem Example


```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

Input:  [[1,4],[4,5]]
Output: [[1,5]]   ← touching intervals merge too
```


:::

::: tldr
<p>💡 Sort by start time first. Then one pass — if current interval overlaps with last merged, extend it. Otherwise add it as new.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Sort intervals by start time</li>
      <li>Add first interval to result. For each subsequent interval: if <code>start &lt;= result[-1][1]</code> → overlap → extend end to <code>max(result[-1][1], end)</code></li>
      <li>Otherwise append as new interval</li>
    </ol>
:::

::: why Why sort first?
<p>Once sorted by start time, any two intervals that overlap are guaranteed to sit right next to each other in the list — so you only ever need to compare each interval to the one right before it. Without sorting, you'd have to compare every interval against every other one to find overlaps, which is much slower. Sorting costs a bit upfront (O(n log n)), but then one simple left-to-right pass (O(n)) finds everything.</p>
:::

::: code Final code


```python
def merge(self, intervals):
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            # overlap — extend the last interval's end
            result[-1][1] = max(result[-1][1], end)
        else:
            # no overlap — add as new interval
            result.append([start, end])

    return result
```


:::

::: remember Key details
<p>Use <code>max(result[-1][1], end)</code> not just <code>end</code> — one interval might be fully contained inside another e.g. <code>[1,10]</code> and <code>[2,3]</code>. The <code>&lt;=</code> in the overlap check handles touching intervals like <code>[1,4],[4,5]</code>.</p>
:::

