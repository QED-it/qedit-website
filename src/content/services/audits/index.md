---
shortTitle: "security audit"
title: "Security Audits for Zero-Knowledge & Cryptographic Systems"
tagline: "We find the bugs that matter in ZK circuits, proof systems, and cryptographic protocols, before they reach production."
intro: "Our audits go deep into the cryptography itself, not just the surrounding code. We review circuit constraints, soundness and zero-knowledge properties, protocol design, and implementation, and we report findings teams can act on."
metaTitle: "ZK & Cryptography Security Audits - Circuits, Proof Systems, Protocols"
metaDescription: "Deep security audits of ZK circuits, proof systems, and cryptographic protocols. We review Rust, C, C++, and Go codebases for soundness, zero-knowledge, and implementation bugs — before they reach production."
order: 1
---

## What we audit

We specialize in cryptography-heavy codebases and zero-knowledge proof system implementations. Our work spans three layers, and we can engage at any one of them — a single layer, or all three, depending on what your project needs:

1. The proof system implementation — the concrete implementation of schemes such as Groth16, PLONK, Halo, Bulletproofs, and their variants, including the underlying finite-field and elliptic-curve arithmetic.
2. The arithmetic circuits encoding the zero-knowledge statements being proved — where a single missing or under-constrained wire can silently break soundness and let a prover forge a valid proof for a false statement.
3. The protocol surrounding the scheme — commitment schemes, Fiat-Shamir transcripts, nullifier and note constructions, key derivation, signature schemes, and the transaction logic that ties them together.

## Languages and ecosystems

We work primarily in Rust — with additional experience in C++ and Go — across the Zcash, Ethereum, and Solana ecosystems. Our engineers have shipped production shielded-transaction code themselves, so we understand the design decisions and trade-offs developers face — and we catch the gaps between what the specification requires and what the code enforces.

## How a cryptography audit works

Every engagement starts from the specification. We compare the implementation against the spec line by line, reason about the security properties each component is relied on for — collision resistance, binding and hiding, zero-knowledge — and check that the constraint system enforces exactly what the protocol requires: no more and no less. When a scheme isn't fully specified, we can help close that gap as part of the audit — we've worked with teams to put a proper specification together first, then audited the implementation against it. You receive a written report with severity-rated findings, concrete reproductions, and actionable recommendations.