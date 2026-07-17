---
company: "reolink"
id: "reolink-q6"
order: 6
label: "Reolink — Question 6"
navLabel: "Q6 — HTTP POST/PUT/PATCH"
title: "HTTP — POST, PUT, PATCH"
---

::: problem Asked
<p>Difference between POST, PUT, and PATCH.</p>
:::

::: remember ✅ Correct (you doubted yourself)
<p>POST creates, PUT replaces and needs the full object, PATCH updates just the fields you pass. Accurate.</p>
:::

::: insight What they're testing
<p>Whether you understand idempotency as a reliability guarantee — not just method definitions memorized from a REST cheat sheet.</p>
:::

::: why The reasoning
<p>Networks drop responses, so clients sometimes retry blindly without knowing if the first call worked. Idempotent methods (PUT, DELETE, GET) make that safe — same end state no matter how many times you call it. POST isn't idempotent because "create" called twice means two things exist. PATCH can't promise idempotency either way because it depends entirely on what's inside the patch (setting a field is idempotent, incrementing a counter isn't) — that's a property of the payload, not the method.</p>
:::

::: tldr
<p>💡 Idempotency is really a promise about what happens if the network drops the response and something retries blindly.</p>
:::

