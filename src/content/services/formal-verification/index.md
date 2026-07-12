---
title: "Formal Verification"
tagline: "We prove cryptographic systems correct with machine-checked proofs in Lean. No critical edge case left to chance."
intro: "Formal verification replaces 'we tested it' with 'we proved it.' We model protocols and circuits and produce machine-checked proofs of their core security properties."
order: 2
---

## Why formal verification

Testing shows the presence of bugs, never their absence. For consensus-critical cryptography, where a single missing constraint can mint funds out of nothing and a failure cannot be patched after the fact, that gap matters. Formal verification closes it: we build a mathematical model of a protocol or circuit and produce a machine-checked proof that its security properties hold in every case, not just the cases someone thought to test.

We work primarily in **Lean**, and we apply verification where it earns its cost: consensus-critical code, systems securing significant value, and protocols whose edge cases are impossible to enumerate by hand.

## How we approach it

A verification engagement is a cryptography problem before it is a proof-engineering problem. We start by turning a system's security-critical mechanisms into precise mathematical statements - capturing the structure that actually matters, such as sigma-protocol soundness, range-proof correctness, or balance conservation - and only then design the theorem boundaries, proof strategy, and reusable libraries needed to discharge them.

We then connect the formal model back to the real codebase, building the extraction and checking workflow that keeps the proof tied to the implementation it is meant to be about. Where repetitive proof work can be accelerated with automation and LLM-assisted proof engineering, we use it - without weakening review standards.

## The team

Our formal-verification work combines three kinds of expertise:

- **Formal-methods expertise.** Deep Lean experience across smart-contract systems, cryptographic primitives, and blockchain protocol verification. This is what shapes the formal architecture: definitions, theorem boundaries, proof strategy, reusable libraries, and the final composition argument.
- **Applied cryptography.** Cryptographers with production experience in Zcash, shielded assets, and other privacy protocols. This is what ensures the formal model captures what the implementation actually does.
- **Protocol engineering.** Engineers with Rust, protocol, and verification backgrounds who connect the model back to the codebase and build the tooling that makes verification repeatable.

## Advancing the field: Verified Verifiers

QEDIT is active in [ZKProof's Verified Verifiers working group](https://zkproof.org/verifier/), an effort to formally establish the validity of zero-knowledge proofs by verifying the correctness of the software that runs the verification step.

The group's aim is to select and endorse a verifier for a chosen ZKP scheme, define its properties rigorously, and carry out a full formal verification of an implementation - producing both concrete artefacts and a replicable process that future ZKP schemes can follow. It is the same conviction that drives our client work: for systems this critical, trust should rest on proofs, not on testing.
