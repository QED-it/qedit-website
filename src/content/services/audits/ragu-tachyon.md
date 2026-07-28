---
title: "Security Audit of Ragu Proof-Carrying Data"
context: "Tachyon / Zcash"
types: ["Audit"]
summary: "Security audit of Ragu, the Proof Carrying Data (PCD) scheme for the next-generation of Zcash."
metaTitle: "Ragu PCD Security Audit - Recursive Proofs for Next-Gen Zcash"
metaDescription: "QEDIT's cryptographic audit of Ragu, a proof-carrying data framework for Zcash: split-accumulation folding over the Pasta cycle, revdot R1CS-type constraints, and CycleFold-style recursion."
date: "2026-04-30"
report: ""
order: 1
---

**Final Report (April 2026)**

## Background

Ragu is a purpose-built proof-carrying data (PCD) framework designed to be compatible with the cryptography behind the [Orchard](https://zcash.github.io/orchard/) anonymous payment protocol, enabling recursive proofs over the [Pasta curve cycle](https://electriccoin.co/blog/the-pasta-curves-for-halo-2-and-beyond/). Ragu targets arity-2 PCD, using a [BCCGP16](https://eprint.iacr.org/2016/263) lineage R1CS dialect for arithmetization, [BCLMS21](https://link.springer.com/chapter/10.1007/978-3-030-84242-0_24) split-accumulation for folding, and dense, non-uniform circuits within the PCD tree. All recursion steps are treated as PCD-based, even when only IVC semantics are required for a given step.

The design envisions a future compressed mode - a succinct form using an IPA polynomial commitment scheme, with a verifier dominated by a linear-time MSM.

The constraint system is built around a "revdot" equation - a structured inner product where the witness vector's second quarter is reversed, allowing all multiplication and linear constraints to consolidate into a single check via random challenges. Polynomial commitments use Pedersen vector commitments, and split-accumulation handles PCS batched evaluation, wiring consistency, and revdot products. Recursion follows a CycleFold-inspired design where every proof component is split into a native part and a bridge part, so each curve in the Pasta cycle only performs arithmetic in its own field - eliminating non-native field arithmetic by construction. 

The status of the implementation is “work in progress” (WIP) with acknowledged gaps. In addition, no zero-knowledge, compression, or serialization is present in the audited version.

## Overall Audit Objectives

The audit was split into two stages:

### Stage 1: Audit all foundational crates (up to commit `c9649de`)

1. `ragu_arithmetic` - **primitives.** Audit all functions e.g. MSM, FFT, eval, factor, dot products, geosum, and endoscalars (Uendo).
2. `ragu_pasta` - **pasta curve parameters.** Verify Poseidon constants (round constants, MDS matrices) for Fp and Fq against reference generation, fixed generator sets, `baked` feature for static initialization, and the Cycle trait implementation mapping fields/curves/generators.
3. `ragu_core` - **driver and gadget type system.** Verify the Driver trait contract (alloc/mul/add/enforce_zero), `Maybe<T>` monad, `GadgetKind` unsafe impls, linear expression builders, and Routine predict/execute.
4. `ragu_primitives` - **primitive gadgets.** Audit `Point`, `Element`, `Boolean`, Poseidon sponge, and Endoscalar. 
5. `ragu_macros` - **derive macros.** Verify `#[derive(Gadget)]`, `#[derive(Write)]`, `repr256!`, `gadget_kind!`.
6. `ragu_circuits` - **circuit synthesis backend.** Audit registry key binding and digest computation, s(X,Y) evaluation drivers (SXY/SX/SY consistency), multi-stage witness construction (StageBuilder/StageMask/BondingValidator), block-compressed sparse polynomial operations (revdot, dilate, commit), and trace generation. Verify that circuit mesh interpolation into m(W,X,Y) handles domain management and circuit indexing correctly. Mesh digest binding uses only 6 iterations ([#78](https://github.com/tachyon-zcash/ragu/issues/78), [#316](https://github.com/tachyon-zcash/ragu/issues/316)).

### Stage 2: Audit the `ragu_pcd` crate (up to commit `4a40b3e`)

1. **Fiat-Shamir soundness** - Verify transcript absorption ordering and domain separation across native and nested fields.
2. **Split-accumulation correctness** - Audit revdot folding math: error terms, cross-term completeness, and two-layer reduction. When combining two proofs, child claims are folded into a single accumulated claim - verify no cross-products are dropped. 
3. **Verifier completeness** - Confirm no verification gap allows proof forgery; every proof component is bound by at least one check. Note: the Verifier was incomplete at the time of the audit.
4. **Cross-curve bridge integrity** - Ragu operates on both curves of the Pasta/Vesta cycle simultaneously with a shared transcript; deferred arithmetic handles cross-field operations. Audit endoscalar extraction, nested commitment consistency, and that no forgery path exists through the curve-switching boundary.
5. **Fuse pipeline and internal circuits** - The fuse operation builds proofs through a sequence of stages, deriving Fiat-Shamir challenges from the transcript. Confirm commitment-before-challenge ordering, no witness leakage, safe parallelism, and that internal recursion circuits  enforce the invariants they claim.
6. **Mesh and circuit injection** - Verify that discriminants in public inputs prevent a prover from invoking internal circuits or empty polynomials unassigned in the domain. Confirm [linear constraint keying](https://github.com/tachyon-zcash/ragu/issues/78#issuecomment-3501127315) mitigates mesh polynomial substitution.
7. **Proof structure and edge cases** - Verify trivial proofs (base case seeding), re-randomization, header encoding, claim consistency between fuse and verify, and circuit registration ordering. Note: Re-randomization zero-knowledge is uncertain ([#242](https://github.com/tachyon-zcash/ragu/issues/242)).

## Methodology

The audit was conducted as a manual source code review of all 7 active workspace crates, performed against two snapshots of the `main` branch of the Ragu code base ([https://github.com/tachyon-zcash/ragu](https://github.com/tachyon-zcash/ragu)).

**Note:** Given that Ragu was still WIP as we carried out the audit, we decided to fork the project to work on an internal repository ([https://github.com/QED-it/ragu](https://github.com/QED-it/ragu)) in order not to interfere with the authors’ work. The role of our internal fork was solely to reflect the Ragu code base at specific commits to carry out the audit (see below), and to hold [internal Github issues](https://github.com/QED-it/ragu/issues) created during the audit.

Each audit phase was done against a commit provided by the library authors:

- **Phase 1:** Audit code on commit `c9649de` for `ragu_arithmetic`, `ragu_pasta`, `ragu_core`, `ragu_primitives`, `ragu_macros`, `ragu_circuits`
    - Rust files: 69 files
    - Lines of code and comments (LOC): 12,127 lines

```jsx
c9649de9 (HEAD -> main) 
~/r/crates ❯❯❯ cloc .

(1951.1 files/s, 311799.6 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Rust                            69           1800           2120          10007
TOML                             7             37              7            212
Markdown                        14             79              0            121
-------------------------------------------------------------------------------
SUM:                            90           1916           2127          10340
-------------------------------------------------------------------------------
```

- **Phase 2:** Audit code on commit `4a40b3e` for `ragu_pcd`
    - Rust files: 57 files
    - Lines of code and comments (LOC): 11,066 lines

```jsx
4a40b3e3 (HEAD -> main) 
~/r/crates/ragu_pcd ❯❯❯ cloc .                                      

(1908.4 files/s, 398889.5 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Rust                            57           1387           2262           8804
TOML                             1              8              0             52
Markdown                         2             11              0             17
-------------------------------------------------------------------------------
SUM:                            60           1406           2262           8873
-------------------------------------------------------------------------------
```


> **Phase 1 and Phase 2 - Total:**
> - Rust Files: 126 files
> - LOC: 23,193 lines


The Ragu Book (still WIP at the time of the audit) served as reference material to aid understand the construction and to help guide the audit (i.e. review the intent) but was not treated as an authoritative specification and was not itself in scope.

The audit was carried out in the following ways:

1. **Bottom-up review:** Each crate was audited following the dependency layering, starting from the foundational crates: `ragu_arithmetic`, `ragu_core`, `ragu_macros` . Progressing through `ragu_primitives`, `ragu_circuits`, and `ragu_pasta` before tackling `ragu_pcd`. Ensuring lower-level correctness assumptions were verified and team familiarity acquired before auditing the code that depends on them.
2. **Protocol-to-implementation tracing:** For `ragu_pcd`, the audit traced the protocol design through the fuse pipeline, verifying that each stage's constraints, transcript correctness, and challenge derivations match the intended protocol semantics. In the absence of a formal specification, protocol intent was reconstructed from the code, inline documentation, and the version of the WIP Ragu Book available at the time of the audit.

## Audit Team

This audit was conducted by:

- Antoine Rondelet
- Constance Beguier
- Pablo Kogan

## Key Resources

Our audit was carried out using the following resources:

- The Ragu code base at the specified commits (see above)
- The Ragu book (WIP at the time of the audit)
- Audit scope [document](https://docs.google.com/document/d/17DV_-_u68DtqZxrhTKmMa-Dj1hTqpP0q/edit) provided by the Tachyon team

## Audit time-frame

The audit was carried out from 1st Feb 2026 to 24 April 2026.

## Overall Assessment

The Ragu codebase is well-structured, with clean separation of concerns across the crate hierarchy and consistent use of Rust's type system to enforce protocol invariants at compile time. The code is written to be generic and extendable, and is accompanied by meaningful test infrastructure and thorough inline documentation. At the time of this audit, the project was still a work in progress, though already at a mature stage of development.

No formal or authoritative specification document was available for this engagement. The Ragu Book, which serves as the project's primary reference, was itself still a work in progress and explicitly marked as non-authoritative. The audit therefore required reconstructing the intended protocol semantics from the source code, inline comments, and the Ragu Book, rather than verifying an implementation against a fixed canonical specification.

No critical-severity issues were identified during the audit. Several findings of medium severity were noted, some of which had already been acknowledged by the authors in the code or tracked in GitHub issues. Importantly, several areas central to the protocol's security - including the verifier and the mesh polynomial digest computation - were still incomplete at the time of review, with known gaps marked by *TODO* and *FIXME* comments in the source. These incomplete areas were out of scope for the audit but will require thorough review before production use.

<aside>
Known gaps such as incomplete verification checks, placeholder domain separation tag, absent zero-knowledge and compression, WIP mesh digest computation - are openly documented in both the code and the scoping document. 
</aside>

## General recommendations

Several functions throughout the codebase operate on pairs of iterable data structures (e.g. two `Vec` inputs) without systematically validating that their lengths match (when they should). Mismatched lengths can lead to silent logical errors or panics at runtime. We recommend introducing consistent input validation - particularly length checks - at function boundaries across the codebase. Early and explicit errors at the point of entry are preferable to failures deep in a computation, both for correctness and for usability.

The library targets the Pasta/Vesta curve cycle and introduces a generic `Cycle` trait (`pub trait Cycle: Copy + Clone + Default + Send + Sync + 'static`) that is used throughout the crate hierarchy. Many function signatures are written to be generic over any `Cycle`, which suggests the logic should be curve-agnostic. However, in several cases the function bodies contain logic that is clearly tailored to Pasta and/or Vesta specifically, such as hardcoded constants or assumptions about curve equations. This creates a misalignment between the “genericity” promised by the type signatures and the actual behavior of the code. We recommend closing this gap by adding explicit runtime checks in functions whose logic depends on Pasta/Vesta-specific properties, so that any instantiation with an unsupported curve cycle fails immediately and clearly rather than producing silently incorrect results.

We recommend maintaining a consistent standard of readability across the codebase. In particular, variable shadowing - reusing the same variable name in nested blocks within a single function - should be avoided unless strictly necessary, as it makes control flow harder to follow during review. Additionally, variable names should accurately reflect the values they store. For example, naming a variable `x_4n_minus_1` to represent $x^{4n - 1}$ is clear and appropriate, but naming it `xn_minus_1` misrepresents the stored value and can mislead both reviewers and future contributors. In a cryptographic codebase where the correspondence between mathematical expressions and code is critical, precise naming is especially important.

We recommend leveraging Rust's type system to enforce critical invariants statically wherever possible. For example, several places in the codebase perform field element inversions without guarding against the additive identity, which would cause a panic or produce an undefined result. More broadly, defining dedicated types that encode security-relevant constraints at the type level would strengthen the codebase. A concrete example is the Fiat-Shamir verifier challenges: while the probability of sampling a zero challenge is negligible, introducing a `Challenge` type (or extending `Uendo`) that cannot be instantiated with the additive identity would make this guarantee explicit and eliminate the concern entirely. This approach shifts invariant enforcement from runtime discipline to compile-time guarantees, reducing the surface for subtle bugs as the codebase evolves.

We recommend integrating code coverage tooling (e.g. `cargo llvm-cov`) into the development workflow and CI pipeline. Our analysis showed that several branches and regions across the codebase - including error paths and panic conditions - are never executed by the project’s test suite. Adding tests for these edge cases, including `#[should_panic]` tests where appropriate, would improve confidence in the codebase. We also encourage adding CI gates that prevent merging pull requests which reduce overall coverage or fall below a defined threshold, helping ensure that test coverage improves steadily as the project evolves.

Several functions across the codebase return `Result<T>` despite having no failure path in their implementation - they unconditionally return `Ok(...)`. This unnecessarily burdens callers with error handling for errors that cannot occur, and obscures which functions can genuinely fail. We recommend auditing return types throughout the codebase and removing the `Result` wrapper wherever the function body has no failure path, so that the type signatures accurately reflect the actual behavior.

A formal specification document covering the full protocol structure, the Fiat-Shamir transcript structure, the complete list of verifier checks, and the claim construction invariants would significantly reduce the risk of protocol-level bugs and enable more rigorous future audits.

The public API of the Ragu library was not yet defined at the time of this audit, which meant we could not review the interface exposed to end users. We recommend the authors give careful consideration to API design, ensuring that the exposed surface guides users toward correct usage and makes misuse difficult. A well-scoped API is particularly important for a cryptographic library, where subtle misuse can have security implications that are not immediately apparent.

This audit represents a first-pass review of a codebase that is actively under development, and several significant features remain unimplemented, including proof compression, serialization, and the full zero-knowledge layer. Each of these will introduce substantial new code and new attack surface - particularly compression and the boundary between proof modes. We recommend a follow-up audit once these features are fully implemented.

---

## Audit Findings

### Severity Levels

For code issues, we define 4 severity levels:

- **CRITICAL:** A soundness or security flaw on the critical path of the protocol, with a high likelihood of occurrence. Issues at this level could allow an attacker to break core protocol guarantees, such as forging proofs or bypassing verification.
- **HIGH:** A security-relevant flaw that could compromise protocol integrity or safety, but that may require specific conditions or a less common code path to be triggered.
- **MEDIUM:** A logical error, missing check, or correctness issue without a clear or direct security impact. This level also includes meaningful performance issues where significant improvements are possible.
- **LOW**: Documentation errors or omissions, code style issues, minor optimizations, and other improvements that do not affect correctness or security but would strengthen the overall quality of the codebase.

---

### Audit of the `ragu_arithmetic` crate (Stage 1)

#### 1. MSM `mul()` silently truncates on length mismatch

- **Severity: MEDIUM**
- **Description:** The `mul` / MSM function in `ragu_arithmetic` doesn't explicitly check the length of the iterator parameters. This also contrasts with the behavior of the `dot` function in the same file (which does `assert_eq!(a.len(), b.len());`).
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L152](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L152)
- **Recommendation:** As of now, the `mul` function silently handles mismatched lengths by zipping. To stay consistent, we recommend to either assert equality or document the exact behavior (shorter iterator determines length).

> Full issue: [https://github.com/QED-it/ragu/issues/1](https://github.com/QED-it/ragu/issues/1)

#### 2. MSM mul is not generic across curves

- **Severity: MEDIUM**
- **Description:** The MSM implementation hard-codes a 256-bit scalar size, e.g. `let segments = (**256** / c) + 1;` and `if skip_bytes >= **32** { return 0; }` - so, the function is not safely reusable across all curve implementations (e.g. BW6-761 uses a 377-bit scalar field).
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L152)
- **Recommendation:** The MSM should either:
    - Explicitly document and scope the assumption and rename to `mul_256`, or
    - Make the code generic over the scalar representation length

> Full issue: [https://github.com/QED-it/ragu/issues/16](https://github.com/QED-it/ragu/issues/16)

### 3. Redundant double reversal in test

- **Severity: LOW**
- **Description:** The `test_dot` function reverses the iterator twice in the `dot` call
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L303](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L303)
- **Recommendation:** Reversing twice returns the original order, so the code can be simplified by removing the `rev()` calls.

> ull issue: [https://github.com/QED-it/ragu/issues/2](https://github.com/QED-it/ragu/issues/2)

### 4. Readability improvements for the `add` function

- **Severity: LOW**
- **Description:** The `add` implementation of `Coeff` has several readability issues:
    - **Scattered case ordering:** Simple cases like ONE + ONE and NegativeOne + NegativeOne appear after more complex cases, making the logic harder to follow.
    - **Unnecessary use of NegativeArbitrary:** One match case returns NegativeArbitrary(x - y) when Arbitrary(y - x) would be clearer and more intuitive.
    - **Missing use of Coeff::Two:** The case ONE + ONE returns Coeff::Arbitrary(F::ONE.double()) instead of using Coeff::Two.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/coeff.rs#L67-L96](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/coeff.rs#L67-L96)
- **Recommendation:** Re-arrange the cases in the function to group them more cleanly and add the case `(Coeff::Two, Coeff::NegativeOne) | (Coeff::NegativeOne, Coeff::Two) => Coeff::One`

> Full issue: [https://github.com/QED-it/ragu/issues/7](https://github.com/QED-it/ragu/issues/7)

### 5. Clarify FFT's input/domain size matching assertion

- **Severity: LOW**
- **Description:** The FFT interface expects the Domain's `log2_n` to be passed as input to `fft` (instead of being computed from `input.len()` inside of the function). This interface slightly differs from the textbook pseudocode in `Introduction to Algorithms, Second Edition's Chapter "30.3 Efficient FFT implementations"`. While, the code is not incorrect, an additional comment would be beneficial. In fact, the `log2_n` argument of the function refers to the Domain, yet in the same function declares a variable `n` as `let n = input.len() as u32;` which can be confusing.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/fft.rs#L50-L53](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/fft.rs#L50-L53)
- **Recommendation:** If keeping `log2_n` in the function signature is strictly desired to enforce the input size to be equal to the domain size (at the expense of adding verbosity to the FFT API for something that can be derived inside of the function from `input`), we suggest to slightly rewrite the top of the `fft` function to clarify, via the assert that the function expects the input size to match the size of the domain.

> Full issue: [https://github.com/QED-it/ragu/issues/8](https://github.com/QED-it/ragu/issues/8)

### 6. Avoid unnecessary clone when creating batch inverter scratch space

- **Severity: LOW**
- **Description:** In `Domain::ell`, the code creates scratch space for batch inversion by cloning the denominators vector. This copies all `amount` field elements from `denominators` into `scratch`. This copy is unecessary.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L180-L181](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L180-L181)
- **Recommendation:** Replace the clone with a zero-initialized vector. This allocates the same amount of memory but avoids copying the field element data.

> Full issue: [https://github.com/QED-it/ragu/issues/9](https://github.com/QED-it/ragu/issues/9)

### 7. Inconsistent returned vector ordering in `factor` and `factor_iter`

- **Severity: LOW**
- **Description:** The `factor` and `factor_iter` functions return elements in reverse orders with no clear explanation why.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L70-L99](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L70-L99)
- **Recommendation:** Better document the inconsistent ordering behavior between `factor` and `factor_iter` , by renaming `factor_iter`  as `factor_rev_iter` to make the order explicit. Additionally, `factor` seems only used in tests, so it should be gated with `#[cfg(test)]`.

> Full issue: [https://github.com/QED-it/ragu/issues/10](https://github.com/QED-it/ragu/issues/10)

### 8. Improve implementation of `bitreverse`

- **Severity: LOW**
- **Description:** The code redefines some bit reversal logic that is already available in rust
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/fft.rs#L41C8-L48](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/fft.rs#L41C8-L48)
- **Recommendation:** Simplify the `bitreverse` function to use Rust’s [reverse_bits](https://doc.rust-lang.org/std/primitive.u32.html#method.reverse_bits) for efficiency and simplicity

> Full issue: [https://github.com/QED-it/ragu/issues/10](https://github.com/QED-it/ragu/issues/10)

### 9. MSM mul could process an extra segment

- **Severity: LOW**
- **Description:** The code computes `let segments = (256 / c) + 1;`. This adds an extra segment when c divides 256 exactly.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L185](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L185)
- **Recommendation:** `segments` should be computed as a ceiling division of the scalar bit-length by `c`

> Full issue: [https://github.com/QED-it/ragu/issues/17](https://github.com/QED-it/ragu/issues/17)

### 10. Document how the `bucket_lookup` values were obtained

- **Severity: LOW**
- **Description:** The documentation of the `bucket_lookup` function mentions that the ideal bucket size (in bits) for multiexp were obtained through experimentation. No details are shared about such experimentation, however.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L105](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L105)
- **Recommendation:** It would be beneficial to document the experimentation method used to obtain the values in `LN_THRESHOLDS`. Documenting constants derivation improves maintainability and auditability of the code.

> Full issue: [https://github.com/QED-it/ragu/issues/17](https://github.com/QED-it/ragu/issues/17)

### 11. Optimize `get_at` by using `u32` instead of `u64` for bucket extraction

- **Severity: LOW**
- **Description:** Since `bucket_lookup` returns values ≤ 16, the window size never exceeds 16 bits. Therefore, `get_at` can be optimized by reading 4 bytes and using `u32` instead of 8 bytes and `u64`, without affecting correctness.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L165](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/util.rs#L165)
- **Recommendation:** Use a 4-byte buffer and `u32` instead of an 8-byte buffer and `u64`.

> Full issue: [https://github.com/QED-it/ragu/issues/29](https://github.com/QED-it/ragu/issues/29)

### 12. Use consistent approaches for input checks and invariant enforcement

- **Severity: LOW**
- **Description:** Some functions do explicitly check some invariants / conditions on inputs, while others don't. This is not fully consistent across the crate’s code base. Additionally, when input checks are implemented, their implementation are not always consistent. In some cases the pattern `if NOT CONDITION { panic!(...) }`  is used, while other times, the pattern `assert!(CONDITION)` is used.
- **Code:**
    - [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L39-L45](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L39-L45)
    - [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L156](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_arithmetic/src/domain.rs#L156)
- **Recommendation:** Unless strictly necessary, we suggest to be consistent across the code base and use the same, systematic approach to validate function inputs. That is: using `assert!` and `assert_eq!` macros wherever possible (and thus replace input validation conditional blocks nesting `panic!`)

> Full issue: [https://github.com/QED-it/ragu/issues/50](https://github.com/QED-it/ragu/issues/50)

---

## Audit of the `ragu_pasta` crate (Stage 1)

### 1. Update comments of Poseidon constants derivation

- **Severity: LOW**
- **Description:** The comment documenting the derivation of the Poseidon parameters references the scripts in [https://github.com/daira/pasta-hadeshash](https://github.com/daira/pasta-hadeshash). However, this Github repository is a "fork" of [https://extgit.isec.tugraz.at/krypto/hadeshash/-/tree/master](https://extgit.isec.tugraz.at/krypto/hadeshash/-/tree/master) which hasn't been updated after the addition of extra checks in the parameter derivation functions (see this commit in particular: [https://extgit.isec.tugraz.at/krypto/hadeshash/-/commit/053a1390ebf248d40124f0084ccc8efa0c7317f5](https://extgit.isec.tugraz.at/krypto/hadeshash/-/commit/053a1390ebf248d40124f0084ccc8efa0c7317f5)). Further to this commit (adding extra checks in relation to [https://eprint.iacr.org/2023/537.pdf](https://eprint.iacr.org/2023/537.pdf)) - the README was updated (here: [https://extgit.isec.tugraz.at/krypto/hadeshash/-/commit/208b5a164c6a252b137997694d90931b2bb851c5](https://extgit.isec.tugraz.at/krypto/hadeshash/-/commit/208b5a164c6a252b137997694d90931b2bb851c5)) to mention that the scripts `calc_round_numbers.py` and `generate_parameters_grain.sage` are deprecated and should not be used anymore. We recomputed the parameters with the recommended script and found the same results as those used in Ragu.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_pasta/src/poseidon_fp.rs#L5-L9](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_pasta/src/poseidon_fp.rs#L5-L9)
- **Recommendation:** As a best practice, use the most up to date scripts to generate the parameters (from [https://extgit.isec.tugraz.at/krypto/hadeshash/](https://extgit.isec.tugraz.at/krypto/hadeshash/)) and point to this repository in the comments of the `ragu_pasta` crate.

> Full issue: [https://github.com/QED-it/ragu/issues/37](https://github.com/QED-it/ragu/issues/37)

---

## Audit of the `ragu_core` crate (Stage 1)

### 1. Remove redundant add/sub/extend overrides in `WiredDirectSum`

- **Severity: LOW**
- **Description:** `WiredDirectSum` overrides `add`, `sub` and `extend` from `LinearExpression`. These overrides do not provide meaningful performance benefits and reduce readability
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/drivers/emulator.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/drivers/emulator.rs)
- **Recommendation:** Rely on the trait default implementations for `add`, `sub` and `extend` to keep behavior consistent and the code simpler.

> Full issue: [https://github.com/QED-it/ragu/issues/18](https://github.com/QED-it/ragu/issues/18)

### 2. Simplify `Emulator<Wired<F>>::wires` by collecting values directly

- **Severity: LOW**
- **Description:** `Emulator<Wired<F>>::wires` currently collects intermediate `WiredValue<F>` instances and then performs a second pass to extract their underlying `F` values. We could optimize this implementation by directly collecting `F` values.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/drivers/emulator.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/drivers/emulator.rs)
- **Recommendation:** Collect `F` values directly during gadget traversal by pushing `wire.value()` into the collector. This simplifies the implementation, avoids an intermediate `Vec<WiredValue<F>>`, and reduces overhead.

> Full issue: [https://github.com/QED-it/ragu/issues/20](https://github.com/QED-it/ragu/issues/20)

### 3. Support tuple arities greater than 2 for `Gadget` and `Write`

- **Severity: LOW**
- **Description:** The library provides tuple support for `MaybeCast`via a dedicated macro, but `Gadget`, `GadgetKind`, `Write`are only implemented manually for tuples of size 2. There is no scalable mechanism to support tuples of size > 2 without duplicating boilerplate.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/maybe/cast.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_core/src/maybe/cast.rs)
- **Recommendation:** Introduce a proc-macro that generates `MaybeCast`, `Gadget`, `GadgetKind` and `Write` implementations for a single tuple arity `N`. The macro is explicitly invoked by the user only for the tuple sizes they need.

> Full issue: [https://github.com/QED-it/ragu/issues/30](https://github.com/QED-it/ragu/issues/30)

---

## Audit of the `ragu_primitives` crate (Stage 1)

### 1. multiadd returns Result but cannot fail

- **Severity: LOW**
- **Description:** `multiadd` currently returns `Result<Element<...>>` but the implementation never produces an error and always returns `Ok(...)`. The only failure mode is the `assert_eq!(values.len(), coeffs.len())` which panics instead of using the `Result` type.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/element.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/element.rs)
- **Recommendation:** Keep `Result<Element<'dr, D>>` but remove the `assert_eq!` and instead return an error when `values.len() != coeffs.len()`.

> Full issue: [https://github.com/QED-it/ragu/issues/31](https://github.com/QED-it/ragu/issues/31)

### 2. `endo` returns `Result` but cannot fail

- **Severity: LOW**
- **Description:** The `endo` method currently returns `Result<Self>`, but its implementation has no failure path and always returns `Ok(...)`.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/point.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/point.rs)
- **Recommendation:** Return `Self` directly instead of `Result<Self>` to better reflect the actual behavior of the function and simplify the API for callers.

> Full issue: [https://github.com/QED-it/ragu/issues/33](https://github.com/QED-it/ragu/issues/33)

### 3. Inconsistent constraint counting in Simulator

- **Severity: LOW**
- **Description:** In Simulator, `mul` increments `num_multiplications` only if the check passes, whereas `enforce_equal` increments `num_linear_constraints` even if the equality check fails. This makes constraint-count metrics inconsistent and harder to interpret.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/simulator.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/simulator.rs)
- **Recommendation:**
    - **Option 1:** Count attempted checks everywhere (increment before validation in mul/enforce_zero).
    - **Option 2:** Count only successful constraints everywhere (move enforce_equal counting to success-only).

> Full issue: [https://github.com/QED-it/ragu/issues/34](https://github.com/QED-it/ragu/issues/34)

### 4. Optimize SpongeState::get_rate() to avoid cloning unused state elements

- **Severity: LOW**
- **Description:** The current implementation of SpongeState::get_rate() clones the entire internal state (P::T elements) before truncating it to P::RATE. This results in unnecessary cloning of elements that are immediately discarded.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/poseidon.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/poseidon.rs)
- **Recommendation:** Since only the first P::RATE elements are required, we can reduce cloning overhead by cloning only those elements.

> Full issue: [https://github.com/QED-it/ragu/issues/35](https://github.com/QED-it/ragu/issues/35)

### 5. Consider re-documenting that Uendo::BITS is even

- **Severity: LOW**
- **Description:** In `group_scale` and `field_scale`, we iterate `Uendo::BITS as usize / 2` times, and each iteration calls `bits.next().unwrap()` twice. So the total number of consumed elements is `2 * (Uendo::BITS as usize / 2)`. If `Uendo::BITS` is odd (e.g. 127), then the division `Uendo::BITS as usize / 2` will truncate (e.g. 127 / 2 = 63) and thus the loop will consume `Uendo::BITS - 1` bits, which is a mistake.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/endoscalar.rs#L149-L209](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_primitives/src/endoscalar.rs#L149-L209)
- **Recommendation:** Looking at the code in `ragu_arithmetic/uendo.rs` (not used for the time being, though, see https://github.com/QED-it/ragu/issues/27) we see that the Uendo bit size is checked to be even, but this could be worth adding a comment here (and / or an `assert_eq!`) again for clarity.

> Full issue: [https://github.com/QED-it/ragu/issues/36](https://github.com/QED-it/ragu/issues/36)

</aside>

---

## Audit of the `ragu_macros` crate (Stage 1)

No issues reported on this crate.

---

## Audit of the `ragu_circuits` crate (Stage 1)

### 1. Clarify preconditions for txz evaluation circuit

- **Severity: LOW**
- **Description:** `txz::Evaluate::execute` assumes that `aux` contains the precomputed inverses `(x^{-1}, z^{-1})` and that both `x` and `z` are non-zero, but this is not documented. This makes the circuit easy to misuse and can lead to unexpected inversion/witness failures.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/txz.rs#L43](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/txz.rs#L43)
- **Recommendation:** The code should clearly document these invariants:
    - `aux` must provide `(x^{-1}, z^{-1})`
    - the circuit only works when `x != 0` and `z != 0`

> Full issue: [https://github.com/QED-it/ragu/issues/14](https://github.com/QED-it/ragu/issues/14)

### 2. Document padding invariants in structured Polynomial

- **Severity: LOW**
- **Description:** `first_padding()` and `second_padding()` compute padding using subtraction on `usize` and implicitly assume `w.len()+v.len() <= 2*R::n()` and `u.len()+d.len() <= 2*R::n()`. These invariants are not documented, which makes the code easier to misuse and could lead to underflow/panics if violated.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L316-L321](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L316-L321)
- **Recommendation:** The code should clearly document the required invariants and why they hold (callers check `len <= R::n()`).

> Full issue: [https://github.com/QED-it/ragu/issues/15](https://github.com/QED-it/ragu/issues/15)

### 3. Silent redefinition of the `t(X, Z)` polynomial in the code

- **Severity: LOW**
- **Description:** At the time of the audit, the NARK section of the Ragu Book defined the `t` polynomial as: $t(X, Z) = \sum_{i=0}^{n - 1} X^{4n - 1 - i} (Z^{2n - 1 - i} + Z^{2n + i})$, yet, in the code, the `t` polynomial is defined as the negated version of the Ragu book's polynomial (see the minus sign in front of the sum): $t(X, Z) = - \sum_{i=0}^{n - 1} X^{4n - 1 - i} (Z^{2n - 1 - i} + Z^{2n + i})$
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/mod.rs#L61-L102](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/mod.rs#L61-L102)
- **Recommendation:** Add a comment above the `tx`, `tz`, `txz` functions to document that these functions compute `-t` evaluations to document the inconsistency with the book. Else, rename the functions with a `minus_` prefix to make it crystal clear across the code base that we evaluate -t (e.g rename the functions to `minus_tx`, `minus_tz`, `minus_txy`)

> Full issue: [https://github.com/QED-it/ragu/issues/44](https://github.com/QED-it/ragu/issues/44)

### 4. Improve documentation for `revdot` on structured polynomials

- **Severity: LOW**
- **Description:** Improve the documentation of the `revdot` function on structured polynomials to make the function easier to follow. This function builds upon several "facts" from the Ragu book that aren't necessarily intuitive for the reader of the function.
- **Code:** [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L137-L146](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L137-L146)
- **Recommendation:** Add comment documenting the inner working of the revdot on structured polynomials

```jsx
    /// Inner product of `self` with the reversed `other`.
    /// Given a structured polynomial:
    /// P(x) = \sum_{i=0}^{n-1} [c_i * x^i + b_i * x^{2n-1-i} + a_i * x^{2n+i} + d_i * x^{4n-1-i}]
    /// with vector representation \vec{P} = [ \vec{c} || \vec{\hat{b}} || \vec{a} || \vec{\hat{d}}]
    /// and given another structured polynomial Q(x) which vector representation is:
    ///  \vec{Q} = [ \vec{c'} || \vec{\hat{b'}} || \vec{a'} || \vec{\hat{d'}}]
    /// With the following variable change:
    /// a -> u, b -> v, c -> w
    /// a' -> u', b' -> v', c' -> w'
    /// we get, P = [w, v_rev, u, d_rev]
    /// and Q = [w', v_rev', u', d_rev']
    /// So, revdot(P, Q) = < (w || v_rev || u || d_rev), (d' || u_rev' || v' || w_rev')>
    ///                             = < w, d'> + < v_rev, u_rev'> + < u, v'> + < d_rev, w_rev'>
    /// Given that: < a_rev, b_rev> = < a, b>
    /// (see: https://tachyon.z.cash/ragu/protocol/core/arithmetization.html)
    /// We get: revdot(P, Q) = < w, d'> + < v, u'> + < u, v'> + < d, w'>
```

> Full issue: [https://github.com/QED-it/ragu/issues/46](https://github.com/QED-it/ragu/issues/46)

### 5. Improve documentation of structured polynomial representation

- **Severity: LOW**
- **Description:** The documentation of the structured polynomial representation could be improved. Currently, it requires the reader to mentally reconstruct several non-obvious properties from a single formula.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L33](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/polynomials/structured.rs#L33)
- **Recommendation:** Expend the expression of a structured polynomial in the comments of the code to make the structured polynomial logic easier to follow.

> Full issue: [https://github.com/QED-it/ragu/issues/47](https://github.com/QED-it/ragu/issues/47)

### 6. Improve documentation for `key` parameter in circuit polynomial evaluation functions

- **Severity: LOW**
- **Description:** In the `sx.rs`, `sy.rs` and `sxy.rs` files' `eval` functions, a "key" parameter (a field element) is used to enforce a linear constraint `a_0 = key * c_0` (i.e. `key_wire = key * F::ONE`). The documentation says "Enforce linear constraint key_wire = key to randomize non-trivial evaluations of this circuit polynomial.". In our understanding, the key (which is in fact the **mesh digest**) is used to prevent a prover from constructing or replaying a valid circuit polynomial evaluations independently of the mesh they belong to. In other words, the key is used inside each circuit polynomial to bind each circuit to the mesh they're registered on. It would be beneficial to better document what `key` is (now it's just a `F`) and what its role is.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sx.rs#L122-L125](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sx.rs#L122-L125)
- **Recommendation:** Document what the `key` is and provide more context as to why it's needed to make the code easier to review. Consider introducing a type for the key.

> Full issue: [https://github.com/QED-it/ragu/issues/48](https://github.com/QED-it/ragu/issues/48)

### 7. Rename one to one_wire for clarity in `sxy`, `sx` and `sy` evaluation

- **Severity: LOW**
- **Description:** In the `eval` function from `ragu_circuits/s/sx.rs`, the variable `one` refers to a wire returned by `mul`, while `one` is already conceptually associated with the constant value `F::ONE`. This naming overlap can reduce readability and make the code harder to follow.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sx.rs#L122](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sx.rs#L122)
- **Recommendation:** Rename `one` to `one_wire` to make it immediately clear that this variable represents a wire rather than a field constant.

> Full issue: [https://github.com/QED-it/ragu/issues/52](https://github.com/QED-it/ragu/issues/52)

### 8. Reduce `RefCell::borrow_mut()` calls in `Collector::enforce_zero`

- **Severity: LOW**
- **Description:** `Collector::enforce_zero` builds linear constraints by repeatedly calling `borrow_mut()` inside `TermEnforcer::add_term`. This results in one dynamic `RefCell` borrow per term, which adds avoidable overhead.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sy.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/s/sy.rs)
- **Recommendation:** Borrow the `VirtualTable` once at the start of `enforce_zero` and pass the resulting `RefMut` directly into `TermEnforcer`, rather than re-borrowing the `RefCell` on every call to `add_term`. This eliminates the per-term dynamic borrow overhead without changing any behavior.

> Full issue: [https://github.com/QED-it/ragu/issues/55](https://github.com/QED-it/ragu/issues/55)

### 9. Remove unused `io.write(...)` call in `rx::eval`

- **Severity: LOW**
- **Description:** In `eval`, the call to `io.write(&mut dr, &mut ())?;` has no observable effect. The Collector driver only records multiplication gates and `Wire = ()`, so this write does not modify any state.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/rx.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/rx.rs)
- **Recommendation:** Remove `io.write(&mut dr, &mut ())?;` from `eval`.

> Full issue: [https://github.com/QED-it/ragu/issues/56](https://github.com/QED-it/ragu/issues/56)

### 10. Optimize `rx_configured` by pre-allocating structured polynomial capacity

- **Severity: LOW**
- **Description:** `rx_configured` builds a `structured::Polynomial` by pushing elements into `rx.a`, `rx.b`, and `rx.c` without pre-allocating capacity. Since the exact number of elements to be inserted is known in advance, this may trigger avoidable reallocations.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/staging/mod.rs#L312](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/staging/mod.rs#L312)
- **Recommendation:** Reserve the exact required capacity immediately after entering the forward representation.

> Full issue: [https://github.com/QED-it/ragu/issues/57](https://github.com/QED-it/ragu/issues/57)

### 11. Ensure all `stage_wires` are consumed in `StageGuard::enforced` and `StageGuard::unenforced`

- **Severity: MEDIUM**
- **Description:** `StageGuard::enforced` and `StageGuard::unenforced` inject pre-allocated stage_wires into the computed gadget using an iterator. Currently, the code fails if there are not enough stage wires. But it does not check whether all `stage_wires` were consumed. If fewer wires are consumed than expected (e.g. due to divergence between `Emulator::counter()` and the actual gadget structure), the methods still succeed, leaving unused stage wires silently unverified. In the enforced case, this may mean that some pre-allocated wires are never constrained for equality, which weakens structural guarantees and may hide subtle bugs.
- Code: [https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/staging/builder.rs](https://github.com/QED-it/ragu/blob/c9649de/crates/ragu_circuits/src/staging/builder.rs)
- **Recommendation:** After mapping the gadget, assert that all stage wires have been consumed.

> Full issue: [https://github.com/QED-it/ragu/issues/58](https://github.com/QED-it/ragu/issues/58)

---

## Audit of the `ragu_pcd` crate (Stage 2)

### 1. `for_header` returns Result but cannot fail

- **Severity: LOW**
- **Description:** The `for_header` method currently returns `Result<Padded<'dr, D, H::Output, HEADER_SIZE>>`, but its implementation has no failure path and always returns `Ok(...)`.
- **Code:** [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/step/internal/padded.rs](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/step/internal/padded.rs)
- **Recommendation:** Return `Padded<'dr, D, H::Output, HEADER_SIZE>` directly instead of `Result<Padded<'dr, D, H::Output, HEADER_SIZE>>` to better reflect the actual behavior of the function and simplify the API for callers.

> Full issue: [https://github.com/QED-it/ragu/issues/61](https://github.com/QED-it/ragu/issues/61)

### 2. Clarify terminology and improve code consistency for the circuits registration ordering

- **Severity: LOW**
- **Description:** The circuit registration logic across `ragu_pcd` and `ragu_circuits` has inconsistent comments and uses non-canonical ordering conventions that make the code harder to reason about during review. The logic is fine (the `RegistryBuilder::finalize()` concatenation order is the single source of truth and is enforced mechanically), but the surrounding documentation and code create confusion about *what* the actual layout is and *where* it is defined. The canonical layout, as enforced by `RegistryBuilder::finalize()`, is `internal_circuits | bonding circuits | internal_steps | application_steps`. This should be clarified across the board.
- **Recommendation:**
    - Use consistent terminology for bonding circuits (e.g. avoid aliasing them with “internal masks”)
    - The authoritative ordering definition lives in `RegistryBuilder::finalize()`, and all other locations should reference it rather than redefining the ordering to avoid inconsistencies.
    - Use authoritative order in index arithmetic (e.g. `Ok(CircuitIndex::new(NUM_INTERNAL_CIRCUITS + NUM_INTERNAL_STEPS + i))`  instead of `Ok(CircuitIndex::new(NUM_INTERNAL_STEPS + NUM_INTERNAL_CIRCUITS + i))`)

> Full issue: [https://github.com/QED-it/ragu/issues/62](https://github.com/QED-it/ragu/issues/62)

### 3. Challenge naming for better readability of `Application::verify`

- **Severity: LOW**
- **Description:** The `Application::verify()` method uses similar names for variables (across multiple blocks) which is technically correct but which makes the code harder to understand.
- **Code:** [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/verify.rs](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/verify.rs)
- **Recommendation:** Given how important this section of the code is for the soundness of Ragu, it would be preferrable to use distinct variable names to better differentiate between the proof’s challenges and the fresh challenges sampled to check all the claims.

> Full issue: [https://github.com/QED-it/ragu/issues/63](https://github.com/QED-it/ragu/issues/63)

### 4. Ordering invariant between `compute_native_f` and `poly_queries` is enforced only by comment

- **Severity: LOW**
- **Description:** The prover builds the batch quotient polynomial $f(X) = \sum \alpha^{i} * (p_i(X) - v_i) / (X - x_i)$ in by iterating over polynomial / evaluation-point pairs in a fixed order. The `compute_v` internal circuit independently recomputes the scalar $f(u) = \sum \alpha^{i} * (p_i(u) - v_i) / (u - x_i)$ via `poly_queries`, iterating over the same pairs. As we can see in both formulas, the alpha power ($\alpha^{i}$) assigned to each term depends entirely on its position in the sequence. If the two orderings ever diverge, the implementation in `_08_f.rs` and in the `compute_v.rs` internal circuit (which us triggered in `_11_circuits.rs`) will not equal. This invariant is currently only enforced by a comment in both files.
- **Code:**
    - [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/fuse/_08_f.rs#L75](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/fuse/_08_f.rs#L75)
    - [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/circuits/compute_v.rs#L559](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/circuits/compute_v.rs#L559)
- **Recommendation:** Define a constant storing the query order, and use this constant in both `_08_f.rs`'s `compute_native_f` function and `compute_v.rs`'s `poly_queries` function. Both of these functions should iterate over the query order constant and dispatch on the query to produce their respective outputs.

> Full issue: [https://github.com/QED-it/ragu/issues/65](https://github.com/QED-it/ragu/issues/65)

### 5. Wrap `Transcript::new` in a Ragu-specific constructor

- **Severity: LOW**
- **Description:** `Transcript::new` takes a `tag` parameter to bind the transcript to the protocol context. This is correct, but `RAGU_TAG` must be passed manually at every call site - currently in `fuse/mod.rs` and `internal/native/circuits/hashes_1.rs`. There is nothing preventing a future call site from passing the wrong tag, either in production code or in tests.
- **Code:**
    - [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/fuse/mod.rs#L60](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/fuse/mod.rs#L60)
    - [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/circuits/hashes_1.rs#L234](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/circuits/hashes_1.rs#L234)
- **Recommendation:** Define a ragu-specific transcript constructor
    - `Transcript::new_unbound(tag)`: the current generic constructor, for use in tests and other contexts (if needed)
    - `Transcript::new_for_ragu()` (or just `Transcript::new()` as done now): a wrapper that calls `new_unbound(RAGU_TAG)`

> Full issue: [https://github.com/QED-it/ragu/issues/66](https://github.com/QED-it/ragu/issues/66)

### 6. Improve handling of Header's internal suffixes

- **Severity: LOW**
- **Description:** Internal headers suffixes are only documented in a comment and the `internal` function takes a raw `usize`, with correctness enforced by a runtime assert.
- **Code:** [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/header.rs#L58-L63](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/header.rs#L58-L63)
- **Recommendation:** Follow the same approach as for internal Steps Indices. This improves code consistency and turns a runtime check into a compile-time type check.
    - Define a `InternalSuffixIndex` enum, and
    - Change the `internal` function to take `InternalSuffixIndex` instead of a raw `usize`: `pub(crate) const fn internal(value: InternalSuffixIndex) -> Self { ... }`

> Full issue: [https://github.com/QED-it/ragu/issues/67](https://github.com/QED-it/ragu/issues/67)

### 7. Challenges may be zero

- **Severity: LOW**
- **Description:** The protocol permits challenges to be zero; however, in that case some checks become degenerate, weakening the intended soundness guarantees. This occurs with very low probability.
- **Code:** [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/transcript.rs#L90-L93](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/transcript.rs#L90-L93)
- **Recommendation:** Ensure that challenges are sampled from the non-zero field domain by resampling challenge values until they are non-zero.

> Full issue: [https://github.com/QED-it/ragu/issues/68](https://github.com/QED-it/ragu/issues/68)

### 8. Internal circuits can be registered multiple times

- **Severity: LOW**
- **Description:** The `register_all` function is intended to register internal circuits exactly once, but it does not enforce this invariant. In the overall workflow, however, internal circuits are indeed registered only once.
- **Code:** [https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/mod.rs#L308-L405](https://github.com/QED-it/ragu/blob/4a40b3e/crates/ragu_pcd/src/internal/native/mod.rs#L308-L405)
- **Recommendation:**
    - Ensure at the beginning of the function `register_all` that no internal circuits have already been registered.
    - Ensure at the end of the function `register_all` that exactly `NUM_INTERNAL_CIRCUITS` have been registered.

> Full issue: [https://github.com/QED-it/ragu/issues/69](https://github.com/QED-it/ragu/issues/69)

---

## Miscellaneous Findings

Although a detailed review of the Ragu Book was outside the scope of this audit, we encountered several inconsistencies in the documentation while cross-referencing the code against the specification during our review. These include notation inconsistencies (e.g. mixed group and field naming conventions, use of $\mathbb{Z}_q$ alongside $\mathbb{F}_q$), missing commitments in the stated proof structure (the $S$ commitment is absent from $\pi.x$ in the NARK proof format), and the public input polynomial $k(Y)$ being incorrectly listed as part of the witness $\pi.w$ rather than as a public parameter. The full details of these findings are documented in issues [#59](https://github.com/QED-it/ragu/issues/59) and [#64](https://github.com/QED-it/ragu/issues/64). We note that the code itself handles these elements correctly - the discrepancies are confined to the book.

---

## Conclusion

This audit identified 0 critical-severity issues, 0 high-severity issues, 3 medium-severity issues, and 37 low-severity issues. No soundness-breaking vulnerabilities were found in the reviewed codebase. The issues identified are predominantly logical edge cases, missing input validation, and opportunities to improve code clarity and test coverage. The codebase is well-structured and reflects a careful approach to protocol design, though several areas - particularly around input validation, type-level invariant enforcement, and production-parameter test coverage - would benefit from further hardening as the project matures.

We also note that several foundational crates reviewed during Phase 1 of our audit have since been modified; we encourage the team to review these changes for any regressions or newly introduced issues. Looking ahead, we recommend a follow-up audit once the Ragu verifier, proof compression, serialization, and the full zero-knowledge layer are fully implemented.
