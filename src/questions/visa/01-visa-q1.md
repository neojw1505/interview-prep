---
company: "visa"
id: "visa-q1"
order: 1
label: "Question 1"
navLabel: "Q1 — Bitwise AND Reduction"
title: "Bitwise AND Array Reduction"
---

::: problem Problem
<p>You have a list of <span class="highlight">n</span> numbers, and every number is either <span class="highlight">0</span> or <span class="highlight">1</span>. Bitwise AND just means: compare two numbers, and the result is 1 only if <em>both</em> are 1 (otherwise it's 0). Keep applying AND to each neighboring pair until only one number is left. Every time you get a new (shorter) list, add up all its numbers. <span class="highlight">Add up every one of those totals and return that.</span></p>
:::

::: problem Example 1


```
Input:  [0, 0, 1, 1]
Steps:  [0,0,1,1] → [0,0,1] → [0,0] → [0]
Sums:   2 + 1 + 0 + 0 = 3
```


:::

::: problem Example 2


```
Input:  [1, 1, 1]
Steps:  [1,1,1] → [1,1] → [1]
Sums:   3 + 2 + 1 = 6
```


:::

::: tldr
<p>💡 The 0s don't matter — a 0 next to anything (AND) always makes another 0, it can never turn into a 1. Only groups of 1s sitting next to each other actually matter.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Go through the list once and find each <span class="highlight">group of 1s that sit next to each other</span> (call the group's length L)</li>
      <li>For each group, use the <span class="highlight">Gauss shortcut</span> below instead of looping</li>
      <li>Add up the results from every group</li>
    </ol>
    <div class="formula">L × (L + 1) / 2</div>
:::

::: why Why the Gauss shortcut works
<p>Picture a group of L ones sitting together, like <code>[1,1,1]</code>. Every round, the AND operation shrinks the group by one: first there are L ones, then L-1, then L-2, all the way down to 1. Adding those up (L + (L-1) + (L-2) + ... + 1) is just the numbers 1 through L added together.</p>
    <p>Instead of looping to add 1 + 2 + ... + L, there's a fast shortcut: pair up the smallest and biggest number (1 and L), then the next pair (2 and L-1), and so on. Every pair adds up to the exact same thing — <span class="highlight">L + 1</span>. So the total is just (number of pairs) × (L + 1), which gives the formula <code>L × (L + 1) / 2</code>.</p>
    <p style="color: #fbbf24; font-weight: 500;">🔑 Rule of thumb: any time you're about to write a loop that just adds up 1 + 2 + 3 + ... + something, stop — use this formula instead.</p>


```
# run of [1,1,1] → L = 3
step 0: 3 ones
step 1: 2 ones
step 2: 1 one
total = 3 + 2 + 1 = 6 = 3×4/2
```


:::

::: code Final code


```python
def solve(arr):
    total = 0
    run = 0

    for x in arr:
        if x == 1:
            run += 1
        else:
            total += run * (run + 1) // 2  # Gauss
            run = 0

    total += run * (run + 1) // 2      # don't forget end of array

    return total
```


:::

::: remember Don't forget
<p>The second <code>total += run * (run + 1) // 2</code> after the loop catches runs that end at the array's last element (no 0 to trigger it).</p>
:::

