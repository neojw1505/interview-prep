---
company: "rakuten"
id: "rakuten-q2"
order: 2
label: "Rakuten — Task 2"
labelStyle: "background:#1a2e1a; color:#4ade80;"
navLabel: "Q2 — Plane Seat Families"
title: "Plane Seat Families"
---

::: problem Problem
<p>Plane has N rows, 10 seats per row: <span class="highlight">A B C | D E F G | H J K</span> (no seat I). Aisles between C–D and G–H. A family of 4 needs 4 consecutive seats in one block, OR exactly 2 on each side of an aisle. Return max families that can be seated given reserved seats string S.</p>
:::

::: insight Valid 4-seat placements per row


```
Left split:   B C | D E   (2 left of aisle + 2 right)
Middle block: D E F G     (4 in middle section)
Right split:  F G | H J   (2 left of aisle + 2 right)
```


    <p>An empty row fits <span class="highlight">2 families</span> (e.g. BCDE + FGHJ). A row with reservations: check each placement independently, but DEFG and a split can't both use the same seats.</p>
:::

::: tldr
<p>💡 Per row: check left split, middle block, right split. If middle is free, it blocks both splits. Handle empty rows separately for O(1) each.</p>
:::

::: code Final code


```python
def solution(N, S):
    reserved = {}
    if S:
        for seat in S.split():
            row = int(seat[:-1])
            col = seat[-1]
            if row not in reserved:
                reserved[row] = set()
            reserved[row].add(col)

    total = 0
    # rows with no reservations = 2 families each
    total += (N - len(reserved)) * 2

    for row, taken in reserved.items():
        left  = not taken & {'B','C','D','E'}  # BCDE
        mid   = not taken & {'D','E','F','G'}  # DEFG
        right = not taken & {'F','G','H','J'}  # FGHJ

        if mid:
            total += 1
            # mid uses DEFG; check if left (BC free) or right (HJ free) also fits
            left_only  = not taken & {'A','B','C'}  # ABC side
            right_only = not taken & {'H','J','K'}  # HJK side
            if left_only or right_only:
                total += 1
        else:
            if left:
                total += 1
            if right:
                total += 1

    return total
```


:::

::: remember Key details
<p>When middle block (DEFG) is taken, a second family can still fit if either the ABC side or HJK side has 3 free seats (split: 2 from that side + would need the middle... actually no — if mid is taken those splits are blocked). The only second family is <span class="highlight">entirely within ABC or HJK</span> — but those are only 3 seats so no family fits there. So mid = 1 family max per row unless the left or right splits are also independently clear.</p>
:::

