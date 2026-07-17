---
company: "foodpanda"
id: "foodpanda-q1"
order: 2
label: "FoodPanda — Question 1"
navLabel: "· Q1 — Block Puzzle Exit"
title: "Block Puzzle Exit Order"
---

::: problem Problem
<p>A grid puzzle where horizontal blocks (numbered 0–9) must be removed one at a time by sliding them <span class="highlight">rightward off the grid</span>. Each call to <code>solve(width, height, nb_blocks, grid)</code> returns the number of the next block to move. A block can exit if every cell to its right (on every row it occupies) is empty (<code>.</code>) or a wall (<code>X</code>).</p>
:::

::: problem Grid format


```
['XXXX', 'X111', 'X000', 'X222', 'XXXX']

XXXX   ← wall row
X111   ← block 1 (occupies cols 1-3)
X000   ← block 0
X222   ← block 2
XXXX   ← wall row
```


    <p>Walls (<code>X</code>) appear on borders only. Dots (<code>.</code>) are empty cells. Same digit = same block spanning multiple cells.</p>
:::

::: tldr
<p>💡 A block is removable if nothing but <code>.</code> or <code>X</code> sits to the right of its rightmost cell on every row it occupies.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Scan grid to find each block's <span class="highlight">rightmost column per row</span></li>
      <li>For each block, check all cells to the right of its rightmost cell on each row</li>
      <li>If all clear → that block can exit → return its number</li>
    </ol>
:::

::: code Final code


```python
def solve(width, height, nb_blocks, grid):
    block_rows = {}  # block_id → {row → rightmost_col}

    for r in range(height):
        for c in range(width):
            ch = grid[r][c]
            if ch.isdigit():
                block_id = int(ch)
                if block_id not in block_rows:
                    block_rows[block_id] = {}
                if r not in block_rows[block_id]:
                    block_rows[block_id][r] = c
                else:
                    block_rows[block_id][r] = max(block_rows[block_id][r], c)

    for block_id, row_rightmost in block_rows.items():
        can_exit = True
        for r, rightmost_col in row_rightmost.items():
            for c in range(rightmost_col + 1, width):
                ch = grid[r][c]
                if ch != '.' and ch != 'X':
                    can_exit = False
                    break
            if not can_exit:
                break
        if can_exit:
            return block_id

    return 0
```


:::

::: remember Don't forget
<p>The function is called <span class="highlight">once per round</span> — the game engine updates the grid between calls. You only need to find one valid block per call, not plan the whole sequence.</p>
:::

