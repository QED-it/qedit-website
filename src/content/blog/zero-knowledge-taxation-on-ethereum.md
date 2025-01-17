---
title: "Zero-Knowledge Taxation on Ethereum"
date: "2018-06-25"
authors: ["Kobi Gurkan"]
excerpt: "At QEDIT, we have a mission to provide privacy preserving systems for the enterprise. For the last two years, we've worked on many projects, developing complex SNARK circuits and higher level protocols to tackle different use-cases – asset management, supply chain, real-time risk assessment, predictive maintenance, credit scoring and more."
image: "/images/blog/zk-taxation-diagram.png"
---

At QED‐it, we have a mission to provide privacy preserving systems for the enterprise. For the last two years, we've worked on many projects, developing complex SNARK circuits and higher level protocols to tackle different use-cases — asset management, supply chain, real-time risk assessment, predictive maintenance, credit scoring and more.

We are happy to present one such project that has been done in collaboration with Deloitte. The project has been in the works for the last few months, in which the team in Deloitte utilized the QED‐it SDK to deploy a Zero-Knowledge Blockchain for their chosen use-case — new french tax rules presented in 2018.

## Use-case

It is common for a person to purchase a life insurance contract from an insurer. The person then performs deposits to this contract. In "investment-type" contracts, these deposits are invested by the insurer in different investment vehicles, possibly earning gains.

At some point, the person would like to withdraw their money from the insurer. The question arises — how should these gains be taxed, before paying to the person?

This is where a friction point arises — the new 2018 french tax law binds the calculation of the tax to the *accumulated value* of all life insurance contracts held by the beneficiary.

When the person has contracts with a single insurer, then, naturally, all the data relevant for calculating the tax is held by this insurer. Since it is also possible for a person to purchase life insurance contracts from multiple insurers, a person might not want to expose this highly personal data to the insurer the person is withdrawing from.

What if we had a system, allowing a person to use all of the life insurance contracts from their insurers, and calculate the tax the insurer should pay, without leaking information about other contracts at other insurers?

### Zero-knowledge proofs

Zero-knowledge proofs (ZKPs) allow a verifier to pose a question to a prover, and the prover answers this question, using whatever private data needed to answer it, revealing nothing more than the answer to the question itself.

An example of a question a verifier could pose is "do you know the solution to the following Sudoku puzzle?". Obviously, the prover who knows the solution can show the solution itself. This prover, though, would like to keep the solution secret for now, but convince the verifier that they do know the solution. The prover can use a zero-knowledge proof to just answer "yes"! The cryptographic proof also serves for convincing the verifier that the right question was used on the right data and no one altered the result.

#### zkSNARKs are, amongst other properties, a way to do this process:

1. *Non-interactively* — without a direct interaction between the prover and the verifier.
2. *Succintly* — the proofs are very small.

Explaining zero-knowledge proofs in depth is beyond the scope of this post, and if you wish to know more, I invite you to check out the following resources:

*Trustless Computing on Private Data* – blog post by QED‐it's lead cryptographer Daniel Benarroch and Prof. Aviv Zohar.

*Prove It, Blockchain it: ZKP in Action* – Video of a meetup explaining ZKPs and how to create one for Sudoku.

*The Incredible Machine* – blog post by QED‐it's Chief Scientist Professor Aviv Zohar, explaining trusted setup.

*The Hunting of the SNARK* – a series of riddles to experiment with ZKPs.

## The project: QED-it SDK

At the heart of the QED‐it SDK is an *identity* protocol. This protocol serves as a framework for committing to data by issuers, attesting pieces of data about a user, and allowing an auditor to pose audit questions to this user. The user, in turn, generates a zero-knowledge proof that combines the data inputs and uses a computation on them to answer the audit question.

The QED‐it SDK provides this protocol adapted to families of use-cases, especially the ones discussed and deemed important in the recent [Zero Knowledge Proof Standardization](https://zkproof.org/) workshop. The adaptations includes a set of building blocks for each of these families, allowing an auditor to pose increasingly complex audit questions.

Why is it called an SDK? Well, the SDK allows developers to write "hooks" — their own audit questions using a Domain-Specific Language. The encompassing protocols provide the security guarantees required by most of the use-cases.

### High-level design 