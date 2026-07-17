---
company: "foodpanda"
id: "foodpanda-q2"
order: 3
label: "FoodPanda — Question 2"
navLabel: "· Q2 — Best Superhuman"
title: "Best Superhuman After Filtering"
---

::: problem Problem
<p>Given a dict of <code>{name: score}</code> and a <code>threshold</code>, filter out anyone with a score <span class="highlight">strictly above</span> the threshold. Return the name of whoever has the <span class="highlight">highest remaining score</span>. Answer is always unique.</p>
:::

::: problem Example


```
scores = {'Quicksnail': 140, 'Grey Widow': 246,
          'Magnetoast': 228, 'Pyro Girl': 157, 'Captain Confetti': 87}
threshold = 200

After filter (≤ 200): Quicksnail=140, Pyro Girl=157, Captain Confetti=87
Best → "Pyro Girl"
```


:::

::: tldr
<p>💡 Strictly above = eliminated. Equal to threshold = stays in.</p>
:::

::: code Final code


```python
def solve(scores, threshold):
    best_name = None
    best_score = -1
    for name, score in scores.items():
        if score <= threshold and score > best_score:
            best_score = score
            best_name = name
    return best_name
```


:::

