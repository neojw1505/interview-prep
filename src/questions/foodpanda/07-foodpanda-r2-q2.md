---
company: "foodpanda"
id: "foodpanda-r2-q2"
order: 7
label: "FoodPanda R2 — Question 2"
navLabel: "· Maximum Subarray"
title: "Maximum Subarray (LC 53)"
---

::: problem Problem
<p>Given an integer array, find the subarray with the largest sum and return that sum.</p>
:::

::: tldr
<p>💡 This trick has a name — Kadane's algorithm. The idea: keep a running sum as you go. If that running sum ever drops below 0, it's dragging you down more than helping — throw it away and start fresh from 0, since starting over can only do better than carrying a negative total forward.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Track <code>curr</code> (running sum) and <code>best</code> (max seen so far)</li>
      <li>At each element: add to <code>curr</code>, update <code>best</code>, if <code>curr &lt; 0</code> reset to <code>0</code></li>
      <li>Return <code>best</code></li>
    </ol>
:::

::: code Final code


```python
def maxSubArray(self, nums):
    best = nums[0]
    curr = 0

    for num in nums:
        curr += num
        best = max(best, curr)
        if curr < 0:
            curr = 0

    return best
```


:::

::: remember Why initialise best = nums[0]?
<p>If all numbers are negative, the answer is the least negative number. Initialising to <code>0</code> would incorrectly return <code>0</code> when no subarray sums to 0 or above.</p>
:::

