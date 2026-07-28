---
title: "Zero-Knowledge Taxation with Deloitte"
context: "Deloitte"
types: ["Protocol", "Implementation"]
summary: "An end-to-end zero-knowledge system, built with Deloitte on the QED-it SDK, that computes life-insurance tax owed under France's 2018 rules without exposing a person's other contracts."
metaTitle: "Zero-Knowledge Proofs for Tax Compliance - Deloitte"
metaDescription: "QEDIT and Deloitte built an end-to-end zero-knowledge proof system computing French life-insurance tax on-chain with zkSNARKs on Ethereum — privacy-preserving regulatory compliance without exposing personal data."
date: "2018-06-24"
report: "https://medium.com/qed-it/zero-knowledge-qed-it-sdk-b20a6526e0a6"
order: 3
---

## Overview

QEDIT partnered with Deloitte to build a working zero-knowledge proof application on top of the QED-it SDK, targeting a real regulatory problem: France's 2018 life-insurance tax rules. Deloitte's team used the SDK to deploy a zero-knowledge blockchain for the use case, with QEDIT providing the underlying identity protocol, zero-knowledge proof system, and Ethereum integration.

## The problem

France's 2018 tax law ties the tax on life-insurance gains to the accumulated value of every contract a beneficiary holds, across all insurers. When someone withdraws from one insurer, that insurer needs the right tax figure but the person may not want to reveal the existence or details of contracts held elsewhere. The challenge was to let the correct tax be computed and verified without leaking that private cross-insurer data — precisely the kind of problem zero-knowledge cryptography is built to solve.

## What we built

The system lets a user collect their contracts locally and produce a zero-knowledge proof of the correct tax amount, so an insurer can pay out net of tax without learning anything about the user's other contracts beyond what the audit question itself implies. A key privacy property is that the underlying data, once gathered on the user's own node, never leaves it.

At the core of the QED-it SDK is an identity protocol: issuers commit to data, attest facts about a user, and an auditor poses audit questions that the user answers with a proof. Developers express their own audit questions through a domain-specific language, while the surrounding protocol supplies the cryptographic security guarantees.

The proof was modularized and "glued" together from parts using a proof-chaining technique that connects proofs across different zero-knowledge proof systems. Data-validity proofs established that committed data was published by an approved party, sat under a known Merkle root, and had not been revoked. A separate, compact tax proof carried the actual business logic, written by Deloitte's developer in ZoKrates. Commitments were collected in an append-only Merkle tree for efficient set-membership proofs.

## Decentralized verification on Ethereum

To let parties outside the QED-it network consume the results, we integrated with Ethereum, using the BN128 precompiles introduced in the Byzantium hard fork to verify zkSNARKs on-chain. We implemented a smart contract acting as an autonomous verifier, including an efficient incremental Merkle tree in Solidity, so a contract managing an insurer's wallet could consume a tax proof, settle tax with the authority, and pay the user the remainder. The deployment ran across six nodes, five insurers and one user, on a Proof-of-Authority Ethereum network, packaged with Docker and an HTTP API, alongside a node explorer for monitoring proof activity.

## Why it matters

The collaboration showed an end-to-end path to real-time regulatory compliance where sensitive personal data stays with its owner and only a verifiable result is shared. This work was an early, concrete demonstration of QEDIT's zero-knowledge protocol design and cryptography engineering expertise.

<!-- Original write-up by Kobi Gurkan, QED-it (2018). Linked in the report field above. -->