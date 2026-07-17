---
company: "okx"
id: "okx-q1"
order: 1
label: "OKX — Live Coding"
labelStyle: "background:#1a1a2e; color:#a78bfa;"
navLabel: "Q1 — LCA of Binary Tree"
title: "Lowest Common Ancestor of a Binary Tree (LC 236)"
---

::: problem Problem
<p>Given a binary tree and two nodes <code>p</code> and <code>q</code>, return their <span class="highlight">Lowest Common Ancestor</span> — the deepest node that has both p and q as descendants (a node can be a descendant of itself).</p>
:::

::: problem Example


```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4

LCA(5, 1) = 3
LCA(5, 4) = 5   ← 5 is ancestor of itself
```


:::

::: tldr
<p>💡 Recurse down the tree. If current node is p or q, return it. If left and right both return something, current node is the LCA.</p>
:::

::: insight Key Insight
<p>At every node, you ask its left and right children "did you find p or q down there?" and there are only two things that can happen:</p>
    <div class="comparison">
      <div class="comp-box good">
        <div class="comp-label good">Both sides say yes</div>
        <p>p was found on one side, q on the other — that means this current node is exactly where their paths split, so it's the answer</p>
      </div>
      <div class="comp-box good">
        <div class="comp-label good">Only one side says yes</div>
        <p>p and q are both further down that same side — just pass that answer up unchanged, this node isn't the one</p>
      </div>
    </div>
:::

::: steps How to solve
<ol class="step-list">
      <li>Base case: if node is <code>None</code>, <code>p</code>, or <code>q</code> → return node</li>
      <li>Recurse left and right</li>
      <li>If both left and right are non-null → return current node (it's the LCA)</li>
      <li>Otherwise return whichever side is non-null</li>
    </ol>
:::

::: code Final code


```python
def lowestCommonAncestor(self, root, p, q):
    if not root or root == p or root == q:
        return root

    left  = self.lowestCommonAncestor(root.left, p, q)
    right = self.lowestCommonAncestor(root.right, p, q)

    if left and right:
        return root  # p and q split across both sides
    return left if left else right  # both in same subtree
```


:::

::: remember Key details
<p>Time: O(n) — visits every node once. Space: O(h) recursion stack where h is tree height. The base case handles the "node is its own ancestor" rule — if we hit p, we return it immediately without checking its subtree.</p>
:::

