---
title: "Trustless Computing on Private Data"
date: "2017-06-08"
authors: ["Daniel Benarroch"]
excerpt: "The exchange of data is intrinsic to business processes, allowing partners to share value, information and assets among many others. Untrusting partners, however, tend to use trusted third parties to manage the data and certify its validity on both ends of the process. In this post we are going to focus on how we can use modern cryptographic techniques to solve this centuries old problem of how to get rid of trusted third parties for business processes."
image: "/images/blog/trustless-computing-diagram.png"
slug: "trustless-computing-on-private-data"
tags: ["Cryptography", "Privacy", "Zero Knowledge Proofs", "Blockchain"]
---

## The exchange of data & private data protection

The exchange of data is intrinsic to business processes, allowing partners to share value, information and assets among many others. Untrusting partners, however, tend to use trusted third parties to manage the data and certify its validity on both ends of the process. In this post we are going to focus on how we can use modern cryptographic techniques to solve this centuries old problem of how to get rid of trusted third parties for business processes.

As our running example, let's take the potential business application of online peer-to-peer lending. You wish to lend money to an anonymous person, based on his reputation for not defaulting, and on his credit score. So, who should compute this credit score? This requires access to all of his (the borrower's) transactions! A centralized platform would hold this data and compute the score directly, but in a P2P lending site, only you should have access to your data. The borrower must therefore compute his own credit score, based on his past financial interactions. But then, is this enough for you to approve the loan?

**Or more blatantly:**

> *Can you trust the result of a computation performed by someone else on data that you have not seen?*

This sounds intuitively impossible. It seems ridiculous for you to trust a self-reported credit score, since the borrower has a strong incentive to report a high score. You may like the answer, though.

We will show how to achieve a system where:

1. The lender can verify that the credit score was indeed computed from the borrower's past transactions – and not from fake data; and that the score was correctly computed.
2. The borrower can provide the real score without revealing his underlying data.

Notice that there are trivial ways to achieve each one of the requirements alone:

- Trusting the computation: if we decide to trust the correctness of the result instead of verifying it, we can indeed let the borrower compute his own credit score while keeping his data.
- Relinquishing privacy: if we give up the privacy requirement, we can ask the borrower to reveal all of his data and let the lender compute the score.

There seems to be a trade-off between the privacy of the data and trust in the result of the computation. This trade-off is what motivates non-trusting partners to use third parties for business processes, i.e., a third party is shown the private data and information and is trusted both by the borrower to maintain the privacy of the data and by the lender to compute the credit score correctly.

![Fig. 1: A schematic representation of business processes through third parties.](/images/blog/tech-post-diagrams-1.png)

Our challenge is to avoid the privacy vs. trust trade-off without introducing such a third party. The solution has two parts:

1. Use [*cryptographic commitments*](https://en.wikipedia.org/wiki/Commitment_scheme) in the blockchain to **ground the underlying data.**
2. Use [*verifiable computation*](https://en.wikipedia.org/wiki/Verifiable_computing) schemes (with zero-knowledge) to **prove the computation is correct** without revealing the data.

Let's take a deeper look at each of these two concepts.

### GROUNDING DATA (but keeping it hidden)

Any computation relies on correct inputs to produce correct results, or simply put "Garbage in, garbage out". If the borrower falsifies any of his past transactions, his credit score will be fake, even when the computation is done correctly. We can't directly check if the input to the computation is indeed the borrower's past transactions, because both should remain private. Instead, we use [cryptographic commitments](https://www.zurich.ibm.com/~cca/sft13/smart08chaps2426.pdf) and [verifiable computation](https://mybiasedcoin.blogspot.co.il/2013/09/guest-post-by-justin-thaler-mini-survey.html) to indirectly compare the two. Keep this idea in mind for next section and let's start by understanding commitments better.

Cryptographic commitments hide the data until the commitment is later opened. They also prevent anyone from modifying the data behind the commitment, two properties called *hiding* and *binding* respectively. A good analogy for commitment schemes is placing data in a locked box and handing it to someone. We cannot change the contents of the box once it has been given away, and the receiver cannot see inside until it is opened by the party that owns the data.

One common way of constructing commitment schemes is by using [*collision resistant hash functions*](https://en.wikipedia.org/wiki/Collision_resistance). Hash functions are a type of one-way functions, i.e.: functions that are very easy to compute but extremely difficult to invert, thus hiding the data, yet allowing anyone with the data to recompute the hash and verify that the result is the same as the one previously committed. Even though the computation is deterministic, it is very hard to come up with a different input that would yield the same hash, hence the name collision resistant. This also implies that you could not forge the underlying data to yield the same hash, *binding* you to the original data.

In the context of the credit score computation, our borrower knows all of his transaction history. He can commit to that data, and send the hash to the lender. Still, how do we make sure he did not commit to transactions that did not take place?

#### Blockchain's buzzing!

Posting a hash on the [blockchain](https://en.wikipedia.org/wiki/Blockchain) ensures that anyone committing data cannot give different commitments of the same data to different parties. Furthermore, we can ensure that the data is not manipulated by its owner by having someone else commit to the data. Since the borrower's credit score is determined by his past interactions with others, we can ask *them* to commit to the past transactions and publish the commitment on the blockchain. As the saying goes: don't let the fox guard the hens.

![Fig. 2: Grounding data on the blockchain through commitments.](/images/blog/tech-post-diagrams-2.png)

The immutability of blockchains further ensures that commitments are kept indefinitely and cannot be revised, thus making sure that no one circumvents the binding property of the commitment by replacing the hash itself.

But what good is a commitment to the data if it hides the data from anyone that wishes to verify the computation? After the borrower computes his credit score, how can the lender make sure that the credit score was derived from the data, without revealing the data itself and defeating the purpose of hiding it behind a commitment?

### VERIFIABLE COMPUTATION (on private data)

Now that the data has been grounded, we are only missing two things: the first, to ensure that the borrower is indeed feeding the grounded data as input to his algorithm and second, to ensure that he uses the correct function in the computation. Both can be solved by the building block of *verifiable computation*. In our running example, our goal is to provide Valeria, the lender, with a method to verify whether Peter, the borrower, reported his legitimate credit score, as computed from his past transactions.

To start with, let's define the three main requirements needed from such a scheme:

1. *Completeness:* The result of the computation, provided by Peter, should pass the verification test whenever it was correctly computed.
2. *Soundness:* Peter should fail the test whenever he provides an incorrect answer (e.g., if he gives the wrong credit score).
3. *Zero-Knowledge:* Valeria should not learn anything about the private data input from the verification process, except what is already implied by the result of the computation itself.

Before we overview some of the approaches that yield verifiable computation schemes, let's go back to the problem of ensuring that the grounded data is used as input in the computation.

### Ensuring correct inputs

Is a verifiable computation scheme enough to ensure that Peter uses the correct inputs? Yes. In fact, if the data is grounded on a blockchain, we can make sure that it was fed in as inputs. Given a method to verify the correctness of any computation, we can actually verify the computation of the following algorithm, which is an extension of the original one:

Step 1: Check that the data used as input matches the previously grounded commitment to the data (e.g.: if we use a hash function, we simply recompute the hash and verify that it matches the one in the blockchain), otherwise report failure.

Step 2: Compute the original function over this input data and return the result.

![Fig. 3: Two-step process to ensure correct inputs and correct computation through verifiable computation.](/images/blog/tech-post-diagrams-3.png)

Now the verification algorithm simply provides attestation regarding the correctness of this two-step algorithm, which ensures that the correct inputs were used. Notice that as long as the verification scheme provides zero-knowledge, nothing about the data is leaked since the private data inputs were only used by Peter locally within the program. Putting it all together, the system is exemplified in this diagram.

![Fig. 4: Full scheme for computing on private data and ensuring a correct result.](/images/blog/tech-post-diagrams-4.png)

### Trusted Hardware

One solution to the verifiable computation scenario uses trusted hardware in the machine running the computation. One such example is [Intel's SGX](https://eprint.iacr.org/2016/086.pdf) which provides an isolated environment called an "enclave", in which computations can be run and signed using cryptographic keys that are embedded within the secure hardware. Basically the enclave signs both the result and the code that was executed. The verifier simply needs to check that the result was signed with the proper keys.

This solution, however, relies on Intel's promise that the hardware running the code is indeed isolated and tamper-proof (which is [unclear](https://arxiv.org/abs/1702.07521)) so that the person who physically controls the machine cannot get it to sign on some wrong output. On the flipside, this approach proves to be fast and scalable since all the computations are basically run on a CPU and the attestation process is a simple digital signature.

### Program Obfuscation

Simply put, an obfuscated program is a computer program that, while maintaining its original functionality, was modified to be illegible and difficult to reverse engineer. In particular, if there is a key that is embedded in the code (which is used to sign results), it cannot be easily extracted from the obfuscated code itself. In practice, the only currently available forms of program obfuscation are based on methods that are not cryptographically secure. Typical constructions can be broken by reverse engineering in a couple of days (for example, malware code is typically obfuscated to avoid detection and analysis, but is still often reverse engineered by security researchers).

Cryptographers are very interested in program obfuscation. They strive to root the methods for constructing these schemes on more solid theoretical foundations. One unfortunate result from the academic community, by Barak *et al.*, is [the impossibility of constructing obfuscation schemes that are based on strong requirements](https://www.iacr.org/archive/crypto2001/21390001.pdf). This is why this approach can be said to be closer to science fiction than to practical use. Yet, in 2013, Garg *et al.* constructed the [first candidate of what is known as *indistinguishability obfuscation*](https://eprint.iacr.org/2013/451.pdf), which is a relaxed form of program obfuscation. Still, [current constructions](https://eprint.iacr.org/2017/250.pdf) are computationally inefficient, making them somewhat impractical. Interestingly enough, indistinguishability obfuscation does suffice for [many theoretical applications](https://eprint.iacr.org/2013/454.pdf) such as [*(verifiable) functional encryption*](https://eprint.iacr.org/2016/629.pdf), *zero-knowledge proofs* and other verifiable computation building blocks.

An obfuscation scheme can hypothetically give us the following protocol: The program performs the original computations on the data and then signs the result, attesting to the correctness of the execution. Valeria receives the result and a signature on the result, which she can verify. The signing key is encoded in the encrypted program so that no one can access it and sign false results.

Now the question remains, who generates the signing key and obfuscates the program? Given that Peter, the prover, is the one with incentive to fake the result, it is Valeria, the verifier, who does it. Since the original function is publicly known, Peter can easily check that the obfuscated program computes the right output and does not leak any information. As long as the signature scheme and [obfuscated program cannot be broken](https://eprint.iacr.org/2016/147.pdf), Peter would not be able to forge a signature on a false result. Furthermore, Peter still maintains his privacy, since he is the one running the program.

## Zero-Knowledge Proofs (ZKP) via zkSNARKs

Zero-Knowledge Proofs are generating [much](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/) [excitement](https://www.multichain.com/blog/2016/11/understanding-zero-knowledge-blockchains/) and [buzz](https://www.coindesk.com/trend-towards-blockchain-privacy-zero-knowledge-proofs/) in the blockchain world. This bleeding edge technology [comes from](https://groups.csail.mit.edu/cis/pubs/shafi/1985-stoc.pdf) decades of research in theoretical computer science and cryptography. With [recent results](https://eprint.iacr.org/2013/279.pdf) making ZKP more practical, we have seen the development of a first application: [anonymous cryptocurrencies](https://ieeexplore.ieee.org/document/6956581/). Yet ZKPs can take the blockchain industry much further, potentially disrupting and changing today's best business practices.

Zero-Knowledge Proofs allow verifiers to validate a computation on private data by generating a cryptographic proof that asserts to the correctness of the computed output. ZKPs are hard to grasp intuitively, unless one dives into the [mathematics](https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627) behind them to understand the [details](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6). The proofs that are published with the result are actually strings of bits that are used to verify the claim.

### zk-SNARKs Review

One of the most recent and efficient construction of ZKPs is [zero-knowledge Succint Non-interactive ARguments of Knowledge (zk-SNARKs)](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-ben-sasson.pdf), which is a general-purpose non-interactive ZKP scheme made up of three algorithms: Key Generation (setup phase), Proving and Verification.

1. The key generation or setup procedure requires generating (and then destroying) a random string in order to generate the keys.
2. The prover algorithm generates a proof which is small in size, independent of the runtime of the program, which is why the scheme is called *succinct*.
3. The verification algorithm can verify a proof very quickly, in a time dependent on the size of the input and independent of the length of computation.

These properties contribute to making zk-SNARKs blockchain friendly. Since the proofs are succinct, a blockchain of proofs would not take a lot of memory for the nodes to store. Furthermore, the fast verification allows multiple users that are observing the blockchain to quickly verify a large load of transactions, enabling scalability.

The main downsides of zk-SNARKs are the following:

- The random string must be completely destroyed in order to prevent users from generating proofs that attest to false computations implying that the setup phase is highly sensitive.
- The setup phase is specific to the computation and hence must be re-done if the computation is to be changed.
- Key sizes depend on the length of the computation, which can be prohibitive for long computations.
- The prover takes a considerable amount of time to generate proofs (still much better than other constructions), hence requiring some form of acceleration to make it fully practical.
- The security of this construction depends on cryptographic assumptions, such as the "Knowledge-of-Exponent" assumption, that are not as well understood as some of the more common assumptions.

## CONCLUSION

Let's recall our original motivation: we are interested in mathematically assuring a verifier that the result of a computation was 1) derived from legitimate inputs (solved by grounding data) and 2) computed correctly (solved by verifiable computing). By following the credit score example, we have seen the potential of these new approaches to achieve what was previously thought undoable: to trust a computation by someone else on data that we have not seen.

### Acknowledgements

We would like to thank Jonathan Rouach, Ruben Arnold, Kobi Gurkan, Eran Tromer, Maya Zehavi and Roman Melnikov for their comments and suggestions on improving this post. We would also like to mention Eylon Yogev from the Weizmann Institute of Science, who guided us through the sea of knowledge in program obfuscation. 