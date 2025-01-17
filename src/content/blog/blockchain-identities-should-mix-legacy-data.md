---
title: "Blockchain identities should mix legacy data-don't ignore it, import it"
date: "2017-08-01"
authors: ["Jonathan Rouach"]
excerpt: "We've met many blockchain teams, all working hard to deliver \"phase one\", an exploration into the blockchain technology. It's the best way to get a feel and understand the technology trade-offs. Can these consensus machines become the main rails of communication for their industry?"
image: "/images/blog/legacy-data.jpg"
---

## Blockchain teams and phase 1 in blockchain technology

We've met many blockchain teams, all working hard to deliver "phase one", an exploration into the blockchain technology. It's the best way to get a feel and understand the technology trade-offs. Can these consensus machines become the main rails of communication for their industry?

## The roadmap challange

While the beautiful ideas of decentralized consensus are meeting engineering limitations (and their solutions), we now begin to see a cultural challenge on the roadmap: our clients need to accept a representation of reality that references facts which no longer lie in their systems, but come from other's systems. Today, before blockchain adoption has begun, our clients represent outside reality in databases fully under their control. These legacy systems rely on anything from physical medium (paper) to complex reconciliation mechanisms to interact with the external world, import any relevant fact into their fold, and synchronize each other's views. Blockchains, however, store an uninterrupted chain of truth which is supposed to reflect reality, and this chain spans across organizations.

### Legacy systems & blockchain

It would be a shame if all this exploration work became a graveyard of Proofs of Concept, unused toys lying around in a bank's innovation lab. For these new systems to be useful to our clients, we should recognize that the move to blockchain won't happen in vacuum. Most (initially all) of reality will still be represented in legacy systems. Can't blockchain coexist with digital data from legacy systems?

If you spawn your new assets from scratch on a blockchain, there is no past, and all reality is represented on chain. That's awesome for an ICO (Initial Coin Offering), or a TGE (Token Generation Events), or cryptocurrencies. Those "physical" tokens just didn't exist before, and arguably most won't matter once hype-driven investors move on to the next token. But if you're deploying a useful blockchain to an industry with an existing digital representation of reality, you need to reconcile the two versions. In blockchain talk, you need an oracle: an entity bringing information into the blockchain world, information that wasn't there to begin with.

Every time a participant joins the blockchain, if they aren't born this very second, you have an event of importing some of their history to the blockchain, usually from a legacy system. This is the basis for identity use-cases: import facts about people, companies, long lived assets into the digital realm, without breaking a chain of trust in the data. This digital identity needs to be structured, so you can build on it and infer new facts, during the life-cycle of that identity.

Facts about an identity can be declared, sourced from records, audited or proven using zero knowledge proofs. Let's explore these different ways of grounding truth. A bank transitioning to blockchain will want to represent information on its client, coming from its current, legacy ledger. This bank could, for example, simply declare "this client holds 1M USD in cash" (and maybe sign this digitally), asking other participants to just accept this statement.

A bolder move – total transparency – would be to reveal their client's legacy data and point to the records which it used to establish this fact. Continuing this progression, the bank could choose instead to preserve confidentiality, notarize these legacy records (using a hash commitment) and bring a third-party (auditor) to validate the fact, with a reference to the notarized records. Finally, with the advent of practical zero-knowledge proofs, the bank can now point to notarized legacy record and prove the fact in zero-knowledge, without the need for an auditor.

At QED-it, we see the need for this last scheme repeating in every vertical and every use case, all sharing a need to manage the history and life-cycle of a blockchain identity. For banks, it's about clients moving and exchanging assets which don't initially exist on a blockchain. For aviation, it's about aircrafts long history of maintenance, which is now shadowed by a blockchain representation.

Summarizing, to move from experimentation to deployment of blockchains, industries will need to import facts about identities from legacy systems. Zero-knowledge proofs bridge the gap between legacy systems and blockchain, with minimal leaps of faith, permitting blockchain's un-interrupted sourcing of the origin of data.

*Special thanks to Maya Zehavi for our long discussions on legacy data and identity, leading to this post.* 