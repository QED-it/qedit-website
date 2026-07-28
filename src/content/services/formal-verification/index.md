---
shortTitle: "formal verification"
title: "Formal Verification for Cryptographic & Zero-Knowledge Systems"
tagline: "We prove cryptographic systems correct with machine-checked proofs in Lean. No critical edge case left to chance."
intro: "Formal verification replaces 'we tested it' with 'we proved it.' We model protocols and circuits and produce machine-checked proofs of their core security properties."
metaTitle: "Formal Verification of Cryptographic Systems & ZK Circuits in Lean"
metaDescription: "Machine-checked proofs for consensus-critical cryptography. We model protocols and ZK circuits in Lean and formally verify soundness, correctness, and balance conservation — proven, not just tested."
order: 2
---

## Why formal verification

Testing shows the presence of bugs, never their absence. For consensus-critical cryptography, where a single missing constraint can mint funds out of nothing and a failure cannot be patched after the fact, that gap matters. Formal verification closes it: we build a mathematical model of a protocol or circuit and produce a machine-checked proof that its security properties hold in every case, not just the cases someone thought to test.

We work primarily in **Lean 4**, and we apply verification where it earns its cost: consensus-critical code, smart contracts and systems securing significant value, and protocols whose edge cases are impossible to enumerate by hand.

## What we verify

Our formal verification work spans the same layers as our audits, and we can engage at any one of them — a single property, or an end-to-end proof, depending on what your project needs:

1. **ZK circuit verification.** We prove that an arithmetic circuit encodes exactly the statement it is meant to, so that no under-constrained or missing wire lets a prover forge a valid proof for a false statement — the machine-checked counterpart to a circuit soundness audit.
2. **Proof-system soundness.** We formalize the security properties of the schemes themselves — SNARK soundness, sigma-protocol soundness, and range-proof correctness — and prove they hold under their stated assumptions.
3. **Protocol and smart-contract verification.** We verify the properties the whole system depends on, such as balance conservation (no value is created or destroyed), nullifier correctness, and the state-transition logic of smart contracts and consensus-critical code.

## How we approach it

A verification engagement is a cryptography problem before it is a proof-engineering problem. We start by turning a system's security-critical mechanisms into precise mathematical statements — capturing the structure that actually matters, such as sigma-protocol soundness, range-proof correctness, or balance conservation — and only then design the theorem boundaries, proof strategy, and reusable Lean libraries needed to discharge them.

We then connect the formal model back to the real codebase, building the extraction and checking workflow that keeps the proof tied to the implementation it is meant to be about. Where repetitive proof work can be accelerated with automation and LLM-assisted proof engineering, we use it — without weakening review standards.

## The team

Our formal-verification work combines three kinds of expertise:

- **Formal-methods expertise.** Deep Lean 4 experience across smart-contract verification, cryptographic primitives, and blockchain protocol verification. This is what shapes the formal architecture: definitions, theorem boundaries, proof strategy, reusable libraries, and the final composition argument.
- **Applied cryptography.** Cryptographers with production experience in Zcash, shielded assets, and other privacy protocols. This is what ensures the formal model captures what the implementation actually does.
- **Protocol engineering.** Engineers with Rust, protocol, and verification backgrounds who connect the model back to the codebase and build the tooling that makes verification repeatable.

## Advancing the field: Verified Verifiers

QEDIT is active in [ZKProof's Verified Verifiers working group](https://zkproof.org/verifier/), an effort to formally establish the validity of zero-knowledge proofs by verifying the correctness of the software that runs the verification step.

The group's aim is to select and endorse a verifier for a chosen ZKP scheme, define its properties rigorously, and carry out a full formal verification of an implementation — producing both concrete artefacts and a replicable process that future ZKP schemes can follow. It is the same conviction that drives our client work: for systems this critical, trust should rest on proofs, not on testing.