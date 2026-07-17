---
company: "visa"
id: "visa-q2"
order: 2
label: "Question 2"
navLabel: "Q2 — Two Player Pick"
title: "Two Player Pick Game"
---

::: problem Problem
<p>Two players take turns picking a number from the <span class="highlight">front</span> of a list (Player 1 goes first). Whatever number they pick, they add it to their own score. But if the number they just picked is <span class="highlight">even</span>, the whole list gets flipped backwards before the next turn. Keep going until the list is empty. <span class="highlight">Return Player 1's score minus Player 2's score.</span></p>
:::

::: problem Example 1


```
Input: [3, 2, 6, 1, 4]

P1→3 (odd)    P2→2 (even,rev)    P1→4 (even,rev)
P2→6 (even,rev)    P1→1 (odd)

P1 = 3+4+1 = 8,  P2 = 2+6 = 8  →  Output: 0
```


:::

::: problem Example 2


```
Input: [1, 3, 5]

P1→1 (odd)    P2→3 (odd)    P1→5 (odd)

P1 = 1+5 = 6,  P2 = 3  →  Output: 3
```


:::

::: tldr
<p>💡 Never actually reverse. Reverse + pick from left = pick from right. Just flip a flag.</p>
:::

::: why Why it's the same
<div class="comparison">
      <div class="comp-box bad">
        <div class="comp-label bad">With reverse</div>
        <p>[2, 6, 1, 4]</p>
        <p>reverse → [4, 1, 6, 2]</p>
        <p>pick left → 4</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">Without reverse</div>
        <p>[2, 6, 1, 4]</p>
        <p>just pick right → 4</p>
        <p>same number ✓</p>
      </div>
    </div>
:::

::: steps How to solve
<p>Every iteration, 3 things:</p>
    <div class="arrow-flow">
      <span class="flow-item">PICK</span>
      <span class="flow-arrow">→</span>
      <span class="flow-item">SCORE</span>
      <span class="flow-arrow">→</span>
      <span class="flow-item">UPDATE</span>
    </div>
    <ol class="step-list">
      <li><span class="highlight">Pick</span> — from left or right based on flag</li>
      <li><span class="highlight">Score</span> — add to current player</li>
      <li><span class="highlight">Update</span> — if even, flip direction. Switch player.</li>
    </ol>
:::

::: code Final code


```python
def solve(arr):
    left = 0
    right = len(arr) - 1
    pick_from_left = True

    player1_score = 0
    player2_score = 0
    is_player1_turn = True

    while left <= right:

        # PICK
        if pick_from_left:
            num = arr[left]
            left += 1
        else:
            num = arr[right]
            right -= 1

        # SCORE
        if is_player1_turn:
            player1_score += num
        else:
            player2_score += num

        # UPDATE
        if num % 2 == 0:
            pick_from_left = not pick_from_left

        is_player1_turn = not is_player1_turn

    return player1_score - player2_score
```


:::

