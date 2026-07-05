---
title: "zkInterface"
context: "Zero-Knowledge Standards"
types: ["Design", "Implementation"]
summary: "An open standard, designed and built by QEDIT, for interoperability between zero-knowledge proof systems — letting circuits written in one framework be proved by another."
date: "2019-01-01"
report: ""
order: 5
---

## What zkInterface is

zkInterface is an open standard for interoperability between zero-knowledge proof systems. Zero-knowledge tooling is fragmented: circuits are written in many different frontends — libsnark, ZoKrates, jsnark, Snarky, Bellman, and others — and consumed by many different proving backends, each with its own formats and conventions. zkInterface defines a common, framework-agnostic way to describe a constraint system and its witness, so a circuit built in one framework can be proved by another.

QEDIT designed and implemented zkInterface, and contributed it to the ZKProof standardization effort as a reference for zero-knowledge interoperability.

## How it works

zkInterface specifies a small, purely functional, message-based interface built around rank-1 constraint systems (R1CS), independent of any particular proving system.

- **Frontends and backends.** Frontends produce R1CS constraint systems; backends consume them to generate and verify proofs. zkInterface sits between the two, so any compliant frontend can talk to any compliant backend.
- **Messages.** Interaction happens by exchanging read-only messages — `Circuit`, `Constraints`, and `Witness`. These are defined with a FlatBuffers schema, which fixes a precise byte-level layout and generates read/write code for many languages (C++ and Rust among them). Because messages are self-contained and size-prefixed, they can be streamed through files, pipes, sockets, or shared memory, and concatenated in a single byte stream.
- **Gadgets.** The same interface lets a large circuit be decomposed into reusable gadgets that can be engineered separately, each exchanging `Circuit` messages with the caller in a control flow analogous to a function call. This makes it possible to combine gadgets written in different frameworks inside one constraint system.
- **Instance and witness reduction.** Constructing the constraint system (instance reduction) and assigning concrete values to its variables (witness reduction) are handled as separate, explicitly-requested steps, so the interface supports proving systems both with and without preprocessing.

## Why it matters

Interoperability is a precondition for a healthy zero-knowledge ecosystem. It lets developers choose the best frontend for expressing a circuit and the best backend for proving it, reuse low-level building blocks across projects, and build shared benchmarks. By standardizing the boundary between frontends and backends, zkInterface reduces lock-in and makes advanced cryptography more composable — the same philosophy behind QEDIT's broader work on [zero-knowledge standardization](/research).

## Resources

- **Specification:** [zkInterface Specification](https://github.com/QED-it/zkinterface/blob/master/zkInterface.pdf) — the specification document.
- **Code:** [zkInterface on GitHub](https://github.com/QED-it/zkinterface) — the reference implementation.
- **Demo:** [zkInterface WASM demo](https://qed-it.github.io/zkinterface-wasm-demo/) — a browser demo of the interface in action.
- **Standardization:** [ZKProof](https://zkproof.org/) — the community effort where zkInterface was contributed as an interoperability reference.