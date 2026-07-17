---
company: "reolink"
id: "reolink-q5"
order: 5
label: "Reolink — Question 5"
navLabel: "Q5 — HTTPS & TLS"
title: "HTTPS & TLS"
---

::: problem Asked
<p>Whether you know what HTTPS is.</p>
:::

::: remember Partial
<p>Said it's encrypted, "S" = secure. Correct but surface-level.</p>
:::

::: insight What they're testing
<p>Whether you know HTTPS = TLS, and roughly why the handshake needs both asymmetric and symmetric crypto — not just "it's encrypted."</p>
:::

::: why The reasoning
<p>There are two kinds of encryption at play. <span class="highlight">Symmetric encryption</span> (like AES) is fast, but both sides need to already know the same secret key — a problem when you've never met the other side before. <span class="highlight">Asymmetric encryption</span> (like RSA) solves exactly that: it uses a public key anyone can see plus a private key only the server has, and the math lets two strangers agree on a secret over the open internet without anyone eavesdropping being able to work it out. The catch: asymmetric encryption is too slow to use for a whole conversation. So TLS uses the slow asymmetric method just once, briefly, to agree on a shared secret key — then switches to the fast symmetric method for everything else. That handoff is why HTTPS isn't noticeably slower than HTTP.</p>
    <p>A <span class="highlight">certificate</span> is what proves the public key really belongs to who it claims to — a trusted third party (a Certificate Authority) signs it to vouch for that, and your browser checks that signature before trusting the connection at all.</p>
:::

::: tldr
<p>💡 Asymmetric crypto solves "how do strangers agree on a secret." Symmetric crypto solves "how do we encrypt fast." TLS is the handoff between the two.</p>
:::

