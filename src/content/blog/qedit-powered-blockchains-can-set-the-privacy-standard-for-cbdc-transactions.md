---
title: "QEDIT-Powered Blockchains as Privacy Standard for CBDC Transactions"
date: "2020-05-27"
authors: ["Ori Wallenstein"]
excerpt: "The viability of Central Bank Digital Currencies hinges on privacy-enabled, immutable trust in transaction integrity"
image: "/images/blog/Set-Standards-Blog-Post-1.jpg"
slug: "qedit-powered-blockchains-can-set-the-privacy-standard-for-cbdc-transactions"
tags: ["CBDC", "Blockchain", "Privacy", "Zero-Knowledge Proofs", "Digital Currency"]
seo:
  metaTitle: "Setting the Privacy Standard for CBDC Transactions | QEDIT"
  metaDescription: "VP Product Ori Wallenstein discusses how a QEDIT-powered, Zero-Knowledge blockchain can set the privacy standard for CBDC transactions"
  canonical: "https://qed-it.com/qedit-powered-blockchains-can-set-the-privacy-standard-for-cbdc-transactions/"
  ogTitle: "Setting the Privacy Standard for CBDC Transactions | QEDIT"
  ogDescription: "VP Product Ori Wallenstein discusses how a QEDIT-powered, Zero-Knowledge blockchain can set the privacy standard for CBDC transactions"
  ogImage: "http://qed-it.com/wp-content/uploads/2020/05/Set-Standards-Blog-Post-v2-300x169.jpg"
  publishedTime: "2020-05-27T13:01:25+00:00"
  modifiedTime: "2021-05-11T12:26:51+00:00"
  author: "Ori Wallenstein"
  readingTime: "4 minutes"
  schema: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://qed-it.com/qedit-powered-blockchains-can-set-the-privacy-standard-for-cbdc-transactions/#article",
        "author": {
          "name": "Ori Wallenstein"
        },
        "headline": "QEDIT-Powered Blockchains as Privacy Standard for CBDC Transactions",
        "datePublished": "2020-05-27T13:01:25+00:00",
        "dateModified": "2021-05-11T12:26:51+00:00",
        "wordCount": 814,
        "image": {
          "@type": "ImageObject",
          "url": "http://qed-it.com/wp-content/uploads/2020/05/Set-Standards-Blog-Post-v2-300x169.jpg"
        }
      }
    ]
  }
---

## *The viability of Central Bank Digital Currencies hinges on privacy-enabled, immutable trust in transaction integrity*

Today's fractured economic landscape, coupled with the recent proliferation of electronic payment solutions, has provided the impetus for central banks around the globe to accelerate their pursuit of new and innovative frameworks to keep pace with the state of digital finance in the 21st century. In fact, a recent [survey](https://www.ecb.europa.eu/press/key/date/2020/html/ecb.sp200511~01209cb324.en.html) conducted among 66 Central Banks identified that 80% are working on Central Bank Digital Currencies (CBDCs), including the European Central Bank (ECB). 

While the depth of exploration varies from jurisdiction to jurisdiction, many governments are now actively exploring the prospect of issuing central bank digital currencies (CBDC) on top of [distributed ledger technologies (DLT)](https://www.forbes.com/sites/seansteinsmith/2020/05/19/why-central-bank-digital-currencies-are-good-news-for-blockchain-adoption/#4fcbf583203c) such as enterprise blockchains to optimize their monetary systems and preserve financial stability.

There are many clear benefits to using a distributed ledger to manage a centrally-issued digital currency: 

* Trust-minimized accounting
* Higher levels of security
* More effective AML monitoring
* Faster settlement times
* And a host of other efficiency gains

Yet despite the clear incentive structure behind a CBDC-denominated, DLT monetary system, central banks cannot use a transparent, shared ledger that broadcasts private transactional details to all members of the network. Doing so would trigger significant legal challenges from organizations like [FATF](https://www.fatf-gafi.org/media/fatf/documents/recommendations/Private-Sector-Information-Sharing.pdf) and cause friction with data privacy regulators overseeing GDPR and CCPA compliance.

So how can governments leverage DLT to protect the integrity of CBDC transactions on a distributed network while simultaneously preserving privacy and upholding regulatory compliance?

### Zero-Knowledge Proof Cryptography: A Boon for DLT

QEDIT's Private Asset Transfer solution, based on robust, field-tested zero-knowledge proof (ZKP) cryptography, makes blockchain technology more practical and accessible for financial institutions. At their core, ZKPs allow one party (the prover) to assure another party (the verifier) that a statement is valid without exposing any underlying confidential information about the statement.  

In the context of a QEDIT-powered CBDC blockchain, ZKPs can be used to generate mathematically-sound proofs that attest to the integrity of a digital currency transfer (i.e. to affirm that a transaction has not been double spent and that it complies with all pre-defined rules and guidelines) without revealing raw, transactional details (who sent what, and how much, to whom) on the shared ledger.  

In addition to receiving tremendous validation at [Convergence — the Global Blockchain Conference 2019](https://www.qed-it.com/bringing-validation-to-zero-knowledge-proofs/), ZKP cryptography has been recognized by the [EU](https://www.eublockchainforum.eu/sites/default/files/reports/20181016_report_gdpr.pdf) as a robust privacy-preserving technique for DLT platforms and has been endorsed by the [World Economic Forum](https://www.weforum.org/whitepapers/the-next-generation-of-data-sharing-in-financial-services-using-privacy-enhancing-techniques-to-unlock-new-value) as an important technology for financial services. And with overwhelming support from world-renowned research institutions, leading technology companies, and government-sponsored agencies like [NIST](https://www.nist.gov/), the [ZKProof.org](https://zkproof.org/) standardization initiative is making great strides toward broader industry adoption.

![QEDIT's Private Asset Transfer GUI for CBDC Transactions](/images/blog/Set-Standards-Blog-Post-v2.jpg)
*QEDIT's Private Asset Transfer GUI for CBDC Transactions*

### Delivering Enhanced Privacy and Trust for CBDC Transactions

#### QEDIT's Private Asset Transfer solution includes a number of unique features that make CBDC blockchains more functional and practicable for central banks:

* **Private Issuance of Tokens:** central banks can issue digital currency tokens in the clear or in private according to their local mandate and their country's monetary policy. Separate tokens representing digital securities and other financial assets can also be issued in private.

* **Atomic Swaps:** transacting parties can communicate directly and in real-time to make an asset transfer, bypassing clearinghouses and effectively reducing settlement times to T+0. This efficiency gain, coupled with QEDIT's horizontally scalable proof generation service, keeps your blockchain running smoothly, even when there's a heavy volume of transactions.  

* **Sender ID and transaction confirmations:** central banks can help prevent money laundering and other financial crimes by only validating transactions that include a sender's ID, along with an automated receipt generated by the beneficiary's wallet.

* **Auditing functionality**: Each wallet owner (or blockchain participant that is running a QEDIT node) possesses private view keys that unlock access to their confidential transaction history. These keys can be voluntarily shared with authorized third parties, including auditors and regulators, for compliance purposes.

QEDIT's Private Asset Transfer Solution is blockchain agnostic and compatible with any DLT platform. It has already been integrated into the VMware blockchain stack and can be tested in [VMware's Hands-on Lab](https://labs.hol.vmware.com/HOL/catalogs/lab/6289). This online interactive simulation allows you to view multiple wallet interfaces from the vantage point of different members of a DLT network, including the sender and receiver of a transfer, an auditor, and a node validator. It also provides a view of the shared ledger which is comprised of ZKPs that confirm the validity of asset transfers, rather than the raw transactions themselves.  

To learn more about how QEDIT's privacy solution for blockchains can help central banks and other enterprises harness the full power of DLT, visit [https://www.qed-it.com/privacy-on-blockchains/](https://www.qed-it.com/privacy-on-blockchains/).