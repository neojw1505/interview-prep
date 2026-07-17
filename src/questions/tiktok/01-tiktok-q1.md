---
company: "tiktok"
id: "tiktok-q1"
order: 1
label: "TikTok — Question 1"
navLabel: "Q1 — Max Top of Stack"
title: "Maximize Top of Stack After K Moves (LC 2202)"
---

::: problem Problem
<p>Think of the list <span class="highlight">nums</span> as a stack of plates, where <code>nums[0]</code> is the top plate. You get exactly <span class="highlight">k</span> moves. Each move, you can either take the top plate off, or put back any plate you already removed (on top). After all k moves, <span class="highlight">what's the biggest number you could have on top?</span> If the stack ends up empty, return -1.</p>
:::

::: problem Example 1


```
Input: nums = [5, 2, 2, 4, 0, 6], k = 4
Output: 5

Remove 5, remove 2, remove 2, put back 5
Stack: [5, 4, 0, 6] → top = 5
```


:::

::: problem Example 2


```
Input: nums = [2], k = 1
Output: -1

Only move: remove 2 → stack empty
```


:::

::: tldr
<p>💡 Don't actually simulate every move one by one — there are only 2 possible numbers that could end up on top. Just figure out which one is bigger.</p>
:::

::: insight Key Insight
<p>No matter how you play it, after k moves the top plate has to be one of these two options:</p>
    <div class="comparison">
      <div class="comp-box good">
        <div class="comp-label good">Option A</div>
        <p>Max of first k-1 elements</p>
        <p>(remove them, put best back)</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">Option B</div>
        <p>nums[k] — the k-th element</p>
        <p>(just keep removing k times)</p>
      </div>
    </div>
    <p style="margin-top: 12px;">Answer = <span class="highlight">max(Option A, Option B)</span></p>
:::

::: remember Edge Cases — the hard part


```python
k == 0         → can't move → return nums[0]
n == 1, k odd  → remove, can't put back → return -1
n == 1, k even → remove and put back → return nums[0]
k >= n         → can access all, no Option B
```


:::

::: code Final code


```python
def maximumTop(self, nums, k):
    n = len(nums)
    if k == 0:
        return nums[0]
    if n == 1:
        return -1 if k % 2 else nums[0]

    ans = max(nums[:k-1], default=-1)  # Option A
    if k < n:
        ans = max(ans, nums[k])            # Option B
    return ans
```


:::

::: remember Why this is tricky
<p>It <span class="highlight">looks</span> like you need to act out every move on the stack, but you don't — once you spot the two options above, the code is just 5 lines. The trap is trying to simulate all k moves one by one instead of noticing the pattern.</p>
:::

