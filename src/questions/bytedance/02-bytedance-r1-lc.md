---
company: "bytedance"
id: "bytedance-r1-lc"
order: 2
label: "ByteDance R1 — LC Question"
labelStyle: "background:#1a2535; color:#38bdf8;"
navLabel: "R1 — Number of Islands"
title: "Number of Islands (LC 200)"
---

::: problem Problem
<p>Given a 2D grid of <code>'1'</code> (land) and <code>'0'</code> (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent land cells horizontally or vertically.</p>
:::

::: problem Example


```
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```


:::

::: tldr
<p>💡 Every time you spot a '1' you haven't looked at yet, that's a brand new island. Then use DFS (Depth-First Search — explore as far as you can in one direction before backtracking) to "sink" every connected land cell touching it, turning them to '0' so you never count that island twice.</p>
:::

::: code Final code


```python
def numIslands(self, grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'  # sink the land so we don't revisit
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count
```


:::

::: remember Key details
<p>Modifying the grid in-place avoids a separate visited set. If you can't modify input, use <code>visited = set()</code> instead. Time: O(m×n), Space: O(m×n) recursion stack worst case.</p>
:::

