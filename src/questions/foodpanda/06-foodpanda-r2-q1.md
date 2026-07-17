---
company: "foodpanda"
id: "foodpanda-r2-q1"
order: 6
label: "FoodPanda R2 — Question 1"
navLabel: "· Rotting Oranges"
title: "Rotting Oranges (LC 994)"
---

::: problem Problem
<p>Grid of <code>0</code> (empty), <code>1</code> (fresh orange), <code>2</code> (rotten orange). Every minute, rotten oranges spread to adjacent fresh ones. Return the minimum minutes until no fresh oranges remain, or <code>-1</code> if impossible.</p>
:::

::: tldr
<p>💡 This is a BFS problem (Breadth-First Search — spread outward one "layer" at a time, like ripples in water). The trick: start with <em>every</em> already-rotten orange in the queue at once, not just one — that way each layer you process is exactly one minute passing.</p>
:::

::: steps How to solve
<ol class="step-list">
      <li>Add all initially rotten oranges to the queue. Count fresh oranges.</li>
      <li>BFS level by level — each level = 1 minute. Spread rot to adjacent fresh cells.</li>
      <li>After BFS, if any fresh oranges remain → return <code>-1</code>. Else return minutes elapsed.</li>
    </ol>
:::

::: code Final code


```python
from collections import deque

def orangesRotting(self, grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    directions = [(0,1),(0,-1),(1,0),(-1,0)]

    while queue and fresh > 0:
        minutes += 1
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))

    return -1 if fresh > 0 else minutes
```


:::

