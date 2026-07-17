---
company: "foodpanda"
id: "foodpanda-q3"
order: 4
label: "FoodPanda — Question 3"
navLabel: "· Q3 — String Factorize"
title: "String Factorization (Overlap Concatenation)"
---

::: problem Problem
<p>Given two strings <code>str1</code> and <code>str2</code>, concatenate them in the order that maximises the <span class="highlight">overlap</span> — the longest suffix of the first string that matches a prefix of the second. Write the overlap only once. Tie-break: prefer <code>str1 + str2</code>.</p>
:::

::: problem Example


```
str1 = "1234yyabc"
str2 = "abcxxxx1234"

str1 + str2 order: suffix "abc" matches prefix "abc" → overlap 3
str2 + str1 order: suffix "1234" matches prefix "1234" → overlap 4

Best → str2 + str1 → "abcxxxx1234yyabc"
```


:::

::: tldr
<p>💡 Try both orderings. The one with the longer overlap wins — you save more characters.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Find <code>o1</code>: longest suffix of <code>str1</code> that matches prefix of <code>str2</code></li>
      <li>Find <code>o2</code>: longest suffix of <code>str2</code> that matches prefix of <code>str1</code></li>
      <li>If <code>o2 &gt; o1</code>: return <code>str2 + str1[o2:]</code>, else return <code>str1 + str2[o1:]</code></li>
    </ol>
:::

::: code Final code


```python
def solve(str1, str2):
    o1 = 0
    o2 = 0

    # find longest suffix of str1 matching prefix of str2
    for length in range(min(len(str1), len(str2)), 0, -1):
        if o1 == 0 and str1.endswith(str2[:length]):
            o1 = length
        if o2 == 0 and str2.endswith(str1[:length]):
            o2 = length
        if o1 > 0 and o2 > 0:
            break  # both found, stop early

    if o2 > o1:
        return str2 + str1[o2:]
    else:
        return str1 + str2[o1:]
```


:::

::: remember Key details
<p>Iterate from <span class="highlight">longest to shortest</span> so you find the best overlap first and can break early. Tie goes to <code>str1 + str2</code> — handled by the <code>else</code> branch (only pick str2+str1 if <span class="highlight">strictly greater</span>).</p>
:::

::: pattern Complexity
<p>This solution is O(n²) — at each possible overlap length we compare strings, which itself takes O(n), and we try up to n lengths. There's a faster O(n) way using an algorithm called <span class="highlight">KMP</span> (Knuth-Morris-Pratt), but it's more complex to set up and usually overkill for interview-sized inputs — the O(n²) version here is good enough and much easier to explain out loud.</p>
:::

