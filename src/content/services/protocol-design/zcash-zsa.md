---
title: "Zcash Shielded Assets (ZSAs): The OrchardZSA Protocol"
context: "Zcash"
types: ["Design", "Implementation"]
summary: "QEDIT designed and built OrchardZSA — the protocol that brings user-defined assets (stablecoins, tokens, NFTs) into Zcash's shielded pool with the same privacy as ZEC."
metaTitle: "Zcash Shielded Assets (ZSAs) - OrchardZSA Protocol Design"
metaDescription: "QEDIT designed and built OrchardZSA, the cryptographic protocol bringing user-defined assets — stablecoins, tokens, NFTs — into Zcash's shielded pool with full zero-knowledge privacy."
canonical: "https://qed-it.com/zsa-hub/"
date: "2022-01-01"
report: ""
order: 1
---

OrchardZSA is a full protocol, not a feature. Extending Zcash's Orchard shielded protocol, OrchardZSA defines new issuance keys and asset identifiers, a note and commitment structure for custom assets, a version-6 transaction format, consensus rules for supply tracking and finalization, and an updated fee model — specified across two interdependent ZIPs, ZIP 226 (transfer and burn) and ZIP 227 (issuance).

Funded by more than $4M in Zcash Foundation and Community Grants over five years, independently audited by Least Authority, and being merged into Zcash's consensus-critical crates ahead of the NU7 upgrade, ZSAs are among the most substantial protocol design efforts we've undertaken.

For the complete technical reference — specifications, audits, research threads, tooling, and talks — see the [ZSA Hub](/zsa-hub).