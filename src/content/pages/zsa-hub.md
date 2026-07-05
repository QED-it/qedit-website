---
hero:
  eyebrow: "ZSA Hub"
  title: "The home of Zcash Shielded Assets"
  intro: "Zcash Shielded Assets (ZSAs) bring arbitrary user-defined assets — stablecoins, tokens, NFTs — into Zcash's shielded pool, so they inherit the strongest privacy in the crypto space. The protocol is called OrchardZSA. QEDIT designed and built it. This page is the canonical reference for what it is, why it matters, the multi-year R&D behind it, and every spec, audit, and resource available on the topic."
  meta:
    - label: "Status"
      value: "Audited · testnet upcoming · upstreaming"
    - label: "Target"
      value: "Zcash NU7 (date TBD)"
    - label: "Funding"
      value: "$4M+ across ZF + ZCG grants"
    - label: "Since"
      value: "2021 · 5+ years"

overview:
  title: "What ZSAs are"
  paragraphs:
    - "OrchardZSA extends Zcash's Orchard shielded protocol so that any user-defined asset can be issued, transferred, and burned inside the same shielded pool as ZEC, with the same privacy guarantees. Where most chains expose the sender, receiver, amount, and asset type of every token transfer, a ZSA transfer reveals none of them."
    - "OrchardZSA is a full protocol, not a feature. It defines new issuance keys and asset identifiers, a note and commitment structure for custom assets, a version 6 transaction format, consensus rules for supply tracking and finalization, and an updated fee model. It is specified across two interdependent ZIPs, independently audited, and being merged into Zcash's consensus-critical crates."
    - "The result is a general-purpose asset layer for private value: the machinery for anyone to issue and move their own assets privately on Zcash."

useCases:
  title: "What it enables"
  intro: "One protocol, a wide surface of applications."
  items:
    - title: "Private stablecoins"
      icon: "DollarSign"
      description: "Move dollar- or euro-pegged stablecoins with full shielded privacy, rather than on transparent ledgers that leak every payment."
    - title: "User-defined tokens"
      icon: "Coins"
      description: "Anyone can issue a custom fungible asset on Zcash, with supply tracking and optional finalization enforced by consensus."
    - title: "Shielded NFTs or RWAs"
      icon: "Gem"
      description: "Non-fungible assets / real world assets, issued and transferred privately."
    - title: "Wrapped & bridged assets"
      icon: "Blocks"
      description: "Represent assets from other chains as ZSAs, with burn-based off-boarding for secure bridging."
    - title: "Private asset swaps"
      icon: "ArrowLeftRight"
      description: "Atomic, decentralized swaps between shielded assets, with no trusted intermediary and no exposure of the trade."
    - title: "Controlled issuance"
      icon: "ShieldCheck"
      description: "Transaction controls let issuers attach rules to assets, supporting compliance use-cases while preserving privacy."

whyItMatters:
  title: "Why it matters"
  paragraphs:
    - "Zcash offers the strongest financial privacy in the world. Using zero-knowledge proofs, it cryptographically proves a transaction is valid without revealing the sender, receiver, or amount. Unlike other protocols, which rely on privacy add-ons or trusted third parties, Zcash was designed with a privacy-first mindset."
    - "Today, those privacy guarantees only apply to ZEC (Zcash's native token) - not the stablecoins, tokenized assets, or NFTs people actually want to move privately."
    - "ZSAs change that. They bring arbitrary assets into Zcash's shielded pool, giving stablecoins, tokens, and NFTs the same privacy as ZEC — turning the world's most private network into a home for the entire asset economy."

timeline:
  title: "The R&D behind it"
  intro: "A multi-year protocol-engineering effort, funded across numerous Zcash Foundation and Zcash Community Grants."
  milestones:
    - period: "2021"
      title: "The proposal"
      description: "ZSAs (then UDAs) were proposed on the Zcash forum as a way to bring user-defined assets to Zcash's shielded pool for DeFi."
      href: "https://forum.zcashcommunity.com/t/a-proposal-for-shielded-assets-zsa-uda-for-defi-on-zcash/40520"
      linkLabel: "Original proposal"
    - period: "2022"
      title: "Specification"
      description: "OrchardZSA was specified across ZIP 226 (transfer and burn) and ZIP 227 (issuance), extending the Orchard protocol with custom assets."
      href: "https://zips.z.cash/zip-0227"
      linkLabel: "ZIP 227"
    - period: "2022–2025"
      title: "Grant-funded R&D"
      description: "Successive ZF and ZCG grants funded issuance and transfer, asset swaps, stablecoin support, transaction acceptance, and the surrounding Orchard tooling."
    - period: "Jan 2025"
      title: "Independent audit"
      description: "Least Authority completed a security audit of the OrchardZSA protocol, commissioned by Zcash Community Grants as Zcash Ecosystem Security Lead."
      href: "https://leastauthority.com/blog/audit-of-orchardzsa-protocol/"
      linkLabel: "Audit"
    - period: "2025–today"
      title: "Testnet & upstreaming"
      description: "OrchardZSA is about to get live on a public testnet, with work underway to merge it into Zcash's consensus-critical Orchard crates, targeting the NU7 network upgrade."
  note: "In total, more than $4M has been awarded across numerous Zcash Foundation and Zcash Community Grants over 5+ years to develop the ZSA protocol extension alongside Zcash and Orchard capabilities."

research:
  title: "Research threads"
  intro: "ZSAs are the core, but the effort extends into the cryptographic primitives that make a private asset economy usable."
  items:
    - title: "Asset Swaps"
      description: "Atomic, decentralized swaps of shielded assets directly on Zcash, letting two parties exchange custom assets in a single transaction without a trusted intermediary and without revealing the trade."
      links:
        - label: "Asset Swaps — ZIP draft (PR #780)"
          href: "https://github.com/zcash/zips/pull/780"
        - label: "Asset Swaps — design discussion (issue #736)"
          href: "https://github.com/zcash/zips/issues/736"
    - title: "Hash Time-Locked Contracts (HTLCs)"
      description: "HTLCs on Zcash enable cross-chain atomic swaps and conditional payments, a building block for trust-minimized bridging and interoperability with shielded privacy."
      links:
        - label: "HTLCs on Zcash — design document"
          href: "https://docs.google.com/document/d/148rsnUGhKUZ9ZzOROM96J_ZtQ9UUCt3nmgmqEwPHYXw/edit?usp=sharing"
    - title: "Transaction Controls"
      description: "Mechanisms that let assets carry transfer rules and acceptance conditions, supporting compliance and controlled issuance while keeping transactions shielded."
      links:
        - label: "Introducing Transaction Controls in Zcash"
          href: "https://forum.zcashcommunity.com/t/introducing-transaction-controls-in-zcash/49640"

sections:
  - id: "specs"
    title: "Specifications"
    intro: "The OrchardZSA protocol is defined across two interdependent ZIPs, which must be implemented together."
    links:
      - label: "ZIP 226 — Transfer and Burn of Zcash Shielded Assets"
        description: "How custom assets are transferred and burned under OrchardZSA."
        href: "https://zips.z.cash/zip-0226"
      - label: "ZIP 227 — Issuance of Zcash Shielded Assets"
        description: "Issuance keys, asset identifiers, and the issuance bundle."
        href: "https://zips.z.cash/zip-0227"

  - id: "security"
    title: "Security & Audits"
    intro: "OrchardZSA has been independently audited."
    links:
      - label: "Least Authority — Audit of the OrchardZSA Protocol"
        description: "Independent security audit commissioned by Zcash Community Grants. Final report completed January 2025."
        href: "https://leastauthority.com/blog/audit-of-orchardzsa-protocol/"

  - id: "code"
    title: "Code & Tooling"
    intro: "Open-source tooling for building and testing ZSA transactions."
    links:
      - label: "zcash_tx_tool"
        description: "QEDIT's tool for constructing and exercising Zcash transactions, including ZSAs."
        href: "https://github.com/QED-it/zcash_tx_tool"

  - id: "talks"
    title: "Talks & Videos"
    intro: "Presentations and walkthroughs on ZSAs from QEDIT and the Zcash community."
    links:
      - label: "Introduction to the Zcash Shielded Asset Protocol (ZecHub)"
        description: ""
        href: "https://www.youtube.com/watch?v=RcHwLaFyzQQ"
      - label: "The Future of ZSAs (ZconVI)"
        description: ""
        href: "https://www.youtube.com/watch?v=WgTiqPF7YxE"
      - label: "Exploring Zcash Shielded Assets"
        description: ""
        href: "https://www.youtube.com/watch?v=fvMKccfYR7c"
      - label: "ZSA Demo"
        description: ""
        href: "https://www.youtube.com/watch?v=1MZMGC9ViyA"

  - id: "community"
    title: "Grants & Community"
    intro: "The proposals, grants, and discussion that funded and shaped the work."
    links:
      - label: "All ZSA threads on the Zcash forum"
        description: "Every forum thread mentioning ZSAs."
        href: "https://forum.zcashcommunity.com/search?expanded=true&q=zsa"
      - label: "Zcash Shielded Assets: Asset Swaps and Beyond"
        description: "Grant proposal / discussion."
        href: "https://forum.zcashcommunity.com/t/zcash-shielded-assets-asset-swaps-and-beyond/44497"
      - label: "Let's bring stablecoins to ZSAs"
        description: "Grant proposal / discussion."
        href: "https://forum.zcashcommunity.com/t/lets-bring-stablecoins-to-zsas/47041"
      - label: "Zcash Shielded Asset Swaps and Transaction Acceptance"
        description: "Grant proposal / discussion."
        href: "https://forum.zcashcommunity.com/t/zcash-shielded-asset-swaps-and-transaction-acceptance/48432"
      - label: "Grant Application - Zebra ZSA Integration"
        description: "Zcash Community Grants tracking issue."
        href: "https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/6"
      - label: "Grant Application - ZSAs in NU7, H2 2025 extension"
        description: "Zcash Community Grants tracking issue."
        href: "https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/44"
      - label: "Grant Application - OrchardZSA finalization"
        description: "Zcash Community Grants tracking issue."
        href: "https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/154"

faq:
  title: "FAQ"
  items:
    - question: "Why is it taking so long to ship ZSAs?"
      answer: "Shipping ZSAs means a Zcash network upgrade, and network upgrades in crypto take time by design: they touch consensus-critical software and require coordination across the whole ecosystem. Because ZSAs change how value is issued and moved, correctness is non-negotiable, which is why the protocol has been thoroughly specified and independently audited before any deployment. The main remaining step is merging our ZSA implementation from QEDIT's forks into the upstream Zcash repositories ahead of a network upgrade. In parallel, the Zcash ecosystem has rightly been focused on other critical priorities — the deprecation of zcashd, the NU7 upgrade, and NU6.3 (Ironwood) — which naturally adds latency before the ZSA forks are merged upstream and deployed."
      linkLabel: "NU6.3 Ironwood"
      linkHref: "https://forum.zcashcommunity.com/t/ironwood-verifying-the-soundness-of-zcash-s-circulating-supply/56044/61"
    - question: "What applications will ZSAs enable?"
      answer: "ZSAs make Zcash a home for private versions of the assets people actually use. That includes stablecoins that move with full shielded privacy (and, via transaction controls, with compliance where it's required), private and atomic asset swaps directly on Zcash, tokenized real-world assets and NFTs that stay confidential, and wrapped or bridged assets brought over from other chains. In short, any asset that benefits from strong privacy becomes possible on the world's most private financial network."
    - question: "Is OrchardZSA audited?"
      answer: "Yes. Least Authority completed an independent security audit of the OrchardZSA protocol, commissioned by Zcash Community Grants as Zcash Ecosystem Security Lead, with the final report completed in January 2025. The report is linked in the Security & Audits section above."
    - question: "How can I start building with ZSAs?"
      answer: "Start with the specifications (ZIP 226 and ZIP 227) and QEDIT's zcash_tx_tool for constructing and testing ZSA transactions, all linked above. If you're planning an integration or have a specific use-case in mind, get in touch — we designed the protocol and are happy to help."

closing:
  title: "Building with ZSAs?"
  subtitle: "We designed the protocol. Talk to us about issuance, transfers, swaps, or integrating ZSAs into your application."
  ctaText: "Get in touch"
  ctaHref: "/contact-us"
---