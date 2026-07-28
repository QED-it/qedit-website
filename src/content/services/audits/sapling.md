---
title: "Security Audit of Zcash Sapling"
context: "Zcash"
types: ["Audit"]
summary: "Security audit of the Zcash Sapling Spend and Output circuits, comparing the sapling-crypto implementation against the specification."
metaTitle: "Zcash Sapling Security Audit - Spend & Output Circuit Review"
metaDescription: "QEDIT's cryptographic audit of Zcash Sapling: a spec-to-implementation review of the Spend and Output zk-SNARK circuits, Pedersen hash and commitment security, and Blake2s gadgets."
date: "2018-10-25"
report: "https://raw.githubusercontent.com/QED-it/sapling-audit/master/sapling-audit-report.pdf"
order: 4
---

## Overview of the audit

QEDIT reviewed the cryptography and constraint system of Zcash's Sapling upgrade, comparing the `sapling-crypto` implementation against the Sapling specification side by side. The review focused on the two zk-SNARK circuits at the heart of Sapling: the **Spend circuit** and the **Output circuit**, along with the low-level gadgets and hash constructions they rely on. A second revision added a dedicated analysis of the Blake2s circuit implementation.

The work covered both correctness (does the circuit enforce what the spec requires?) and security (do the underlying cryptographic constructions provide the properties they are relied on for?).

## Scope of the audit

The review examined:

- The **Spend** and **Output** circuits and how their components map to the specification.
- Core gadgets, including `Num::into_bits_le_strict` and `boolean::alloc_conditionally`, verified against their intended constraints.
- The **Pedersen hash** and Pedersen commitment constructions — collision resistance, injectivity, and the binding and hiding properties of `WindowedPedersenCommit`, `MixingPedersenHash`, and `NoteCommit`.
- The `GroupHash` / `FindGroupHash` construction and its use of Blake2s as a random oracle.
- The **Blake2s** circuit itself: the compress function, and the XOR and MultiEq modules used within it.

## Audit summary

The audit did not identify critical vulnerabilities. Its value was in the depth of the specification-to-implementation comparison, the security arguments for the Pedersen constructions, and a set of findings and recommendations, the most notable being:

- **Spec notation mismatches and missing parts.** A number of places where the specification and the `sapling-crypto` code used different notation or where the spec omitted detail that required reading the code to resolve — for example, an under-specified `abst_J`, an unlisted constraint count for Pedersen hash, and a likely typo in one of the appendix theorems. We recommended concrete spec clarifications.
- **Bit unpacking between Merkle tree layers.** The circuit enforces congruent equality rather than a strict canonical representation, so a small fraction of Pedersen-hash outputs admit two valid 255-bit representations. This slightly reduces second-preimage resistance by a fraction of a bit — assessed as **low severity**, not significant in practice.
- **Structural recommendations.** `NoteCommit`, `MerkleCRH`, and `MixingPedersenHash` are defined as distinct functions in the spec but appear only as inlined code inside the Spend circuit, which makes analysis harder. We recommended abstracting them into distinct functions.
- **Test coverage gaps.** We noted places where the circuit handles cases the protocol never exercises (for example, Blake2s inputs larger than one block, and constant-input padding paths), and added tests for them.

## Why it matters

Sapling is the upgrade that made shielded Zcash transactions practical, and its security rests entirely on these circuits enforcing exactly what the protocol specifies — no more and no less. A specification-to-implementation review at this level is precisely where subtle soundness issues hide, and it is the same kind of deep, cryptography-first audit we bring to every proof system we review.

The full report, including the detailed gadget reviews, the Pedersen hash security analysis, and the Sapling protocol diagrams, is linked above.