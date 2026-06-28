---
hero:
  eyebrow: "ZSA Hub"
  title: "The home of Zcash Shielded Assets"
  intro: "Zcash Shielded Assets (ZSAs) bring arbitrary assets to Zcash, letting custom tokens be issued, transferred, and burned with the same shielded privacy as ZEC. QEDIT designed the OrchardZSA protocol. This hub is the canonical reference for the specs, the security work, the tooling, and the talks."

sections:
  - id: "specs"
    title: "Specifications"
    intro: "The OrchardZSA protocol is defined across two interdependent ZIPs, which must be implemented together."
    links:
      - label: "ZIP 226 — Transfer and Burn of Zcash Shielded Assets"
        description: "Defines how Custom Assets are transferred and burned under the OrchardZSA protocol."
        href: "https://zips.z.cash/zip-0226"
      - label: "ZIP 227 — Issuance of Zcash Shielded Assets"
        description: "Defines the issuance mechanism: issuance keys, asset identifiers, and the issuance bundle."
        href: "https://zips.z.cash/zip-0227"

  - id: "asset-swaps"
    title: "Asset Swaps"
    intro: "Beyond issuance and transfer, ZSAs enable decentralized swaps of shielded assets directly on Zcash."
    links:
      - label: "Asset Swaps — design discussion"
        description: "The proposal and discussion for swapping Custom Assets on Zcash (zcash/zips issue #736)."
        href: "https://github.com/zcash/zips/issues/736"

  - id: "security"
    title: "Security & Audits"
    intro: "The OrchardZSA protocol has been independently audited."
    links:
      - label: "Least Authority — Audit of the OrchardZSA Protocol"
        description: "Independent security audit commissioned by Zcash Community Grants as Zcash Ecosystem Security Lead. Final report completed January 2025."
        href: "https://leastauthority.com/blog/audit-of-orchardzsa-protocol/"

  - id: "code"
    title: "Code & Tooling"
    intro: "Open-source tooling for working with ZSA transactions."
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
      - label: "ZSA DEMO"
        description: ""
        href: "https://www.youtube.com/watch?v=1MZMGC9ViyA"

  - id: "community"
    title: "Community"
    intro: "Ongoing discussion across the Zcash community."
    links:
      - label: "Zcash Community Forum — ZSA discussions"
        description: "All forum threads tagged or mentioning ZSAs."
        href: "https://forum.zcashcommunity.com/search?expanded=true&q=zsa"

closing:
  title: "Building with ZSAs?"
  subtitle: "We designed the protocol. Talk to us about issuance, transfers, swaps, or integrating ZSAs into your application."
  ctaText: "Get in touch"
  ctaHref: "/contact-us"
---