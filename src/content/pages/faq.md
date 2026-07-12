---
title: "Frequently Asked Questions"
questions:
  - question: "What does QEDIT do?"
    answer: "QEDIT is an applied cryptography firm. We design cryptographic protocols, audit the systems that implement them, and prove them correct with machine-checked proofs. Our work spans zero-knowledge proofs, formal verification, and privacy-preserving protocol design for teams building systems where correctness cannot fail."

  - question: "What kinds of engagements do you take on?"
    answer: "Three main kinds.<br><br>● <strong>Security Audits</strong> — reviews of ZK circuits, proof systems, and cryptographic protocols, covering both the design and the implementation.<br><br>● <strong>Protocol Design</strong> — new cryptographic protocols from first principles through specification, security analysis, and working implementation.<br><br>● <strong>Formal Verification</strong> — machine-checked proofs, in Lean, that a protocol or circuit satisfies its security properties."

  - question: "What makes a cryptography audit different from a regular smart contract audit?"
    answer: "A cryptography audit goes into the mathematics, not just the code. We review constraint systems for missing or under-constrained checks, examine whether soundness and zero-knowledge properties actually hold, verify that primitives are correctly instantiated, and check that the implementation matches the specification. Bugs at this level do not show up in conventional code review, and they are the ones that break a protocol outright."

  - question: "What is formal verification, and when do I need it?"
    answer: "Formal verification replaces \"we tested it\" with \"we proved it.\" We build a mathematical model of your protocol or circuit and produce a machine-checked proof that its critical properties hold in every case, not just the cases someone thought to test. It is worth it when a failure would be catastrophic and irreversible — consensus-critical code, systems securing significant value, or anything where an edge case cannot be patched after the fact."

  - question: "Which ecosystems and technologies do you work with?"
    answer: "We work across public blockchains and bespoke permissioned networks. Recent work includes Zcash (protocol design and audits, including Zcash Shielded Assets), Solana (confidential token standards), Ethereum, and enterprise and central bank systems. Our implementation work is largely in Rust, and our formal verification work in Lean."

  - question: "What are Zcash Shielded Assets (ZSAs)?"
    answer: "ZSAs bring arbitrary assets — stablecoins, tokens, NFTs — into Zcash's shielded pool, so they inherit the same privacy as ZEC. QEDIT designed the OrchardZSA protocol. Our <a href=\"/zsa-hub\">ZSA Hub</a> is the canonical reference for the specifications, audits, tooling, and research behind it."

  - question: "Are your audit reports public?"
    answer: "Where the client agrees, yes. Published reports are available on the individual work pages under <a href=\"/services/audits\">Security Audits</a>. Some engagements are confidential and are not published."

  - question: "What is ZKProof, and what is QEDIT's role in it?"
    answer: "ZKProof is the open, industry-and-academia initiative standardizing the use of zero-knowledge proofs. QEDIT was a founding contributor and remains active in the effort. You can read more on our <a href=\"/research\">Research</a> page."

  - question: "How do engagements typically start?"
    answer: "Get in touch with a short description of what you are building, the scope you have in mind, and your timeline. We will tell you honestly whether we are the right fit, what we would look at, and what an engagement would involve. If your problem is outside our expertise, we will say so."
---