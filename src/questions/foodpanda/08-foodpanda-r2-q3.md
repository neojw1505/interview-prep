---
company: "foodpanda"
id: "foodpanda-r2-q3"
order: 8
label: "FoodPanda R2 — Question 3"
navLabel: "· Max Consecutive Ones"
title: "Max Consecutive Ones (LC 485)"
---

::: problem Problem
<p>Given a binary array, return the maximum number of consecutive <code>1</code>s.</p>
:::

::: code Final code


```python
def findMaxConsecutiveOnes(self, nums):
    best = 0
    curr = 0

    for num in nums:
        if num == 1:
            curr += 1
            best = max(best, curr)
        else:
            curr = 0

    return best
```


:::

