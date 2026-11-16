# Evidence register — PIONEER-OS v0.1.0

PIONEER-OS parodies overclaiming, circular self-review and artificial certainty. It does **not** establish plagiarism, corporate suppression, conspiracy, or first invention of arithmetic. Any statement of "THEFT CONFIRMED™" in the browser is visibly labelled **fiction / parody**.

## Public chronology (verified GitHub repository metadata; UTC)

| Date | Source | What it establishes |
| --- | --- | --- |
| 2025-10-10 07:52:40 | [multimodalas/fusion-qec-sim](https://github.com/multimodalas/fusion-qec-sim) | Original repository creation |
| 2025-10-10 17:25:48 | [multimodalas/fusion-qec](https://github.com/multimodalas/fusion-qec) | Fork of fusion-qec-sim |
| 2025-10-22 03:34:27 | [QSOLKCB/QEC](https://github.com/QSOLKCB/QEC) | Fork of fusion-qec, source fusion-qec-sim |
| 2025-10-28 | [QEC commit 5934b87](https://github.com/QSOLKCB/QEC/commit/5934b873d89705d0aca35ed471b34dec1cd5869a) | Concrete commit-level October activity |
| 2025-11-01 10:25:11 | [ApexSignalAndrewRusher/Truth](https://github.com/ApexSignalAndrewRusher/Truth) | Creation of that particular public repo |
| 2025-12-25 | Uploaded visualizer ZIP file-entry timestamps | Archive metadata only; not authenticated first publication |

This chronology says when particular *repositories* or files are recorded, not when an underlying abstract idea was first conceived. GitHub fields parent and source ground the fork chain. A chronology is not a proof of access or copying.

## Inspected uploaded software archives

**A1: VCH LLM.tar.gz**

- SHA-256: c7c401aff0804ff49c06a8ce5019c4a0b709c836a1ae3039e2feeb19a5c75d3a
- This bundle contains a React/TypeScript application with claim-weighting, arithmetic and badge code. Its inspection did not identify neural-network model weights.
- In src/lib/vch.ts a purported conservative-truncation line divides a BigInt by one and multiplies by one. That subexpression is algebraically an identity; other conversions must be assessed independently.
- A verdict based on two caller-supplied confidence inputs does not independently verify the truth of the underlying proposition.
- In `src/lib/fixedpoint.ts`, the header claims integer-only arithmetic with **no floats, no doubles, no IEEE 754**, but the code declares `FixedPoint` as a TypeScript `number`, performs `Math.round(real * SCALE)` and `fp / SCALE` at the boundary, and acknowledges floating-point conversion in its comments. JavaScript `number` ordinarily has IEEE-754 binary64 semantics. This contradicts a literal, universal 'no floats' claim; boundary conversion itself can be a perfectly legitimate fixed-point implementation technique.
- Q16.16 represents values using a conventional 16-bit signed integer portion and 16 fractional bits in a 32-bit container. Scale = 65536, nominal resolution = 1/65536, representable range −32768 to +(32767 + 65535/65536). This format is longstanding prior art. The new PIONEER-Q16.16™ UI and command are illustrative satire, not third-party code execution or evidence of copied intellectual property.

**A2: vch-engine-web-visualizer(4).zip**

- SHA-256: dcf22732b7322c40597eaa565b4bc68bfa62a19cef1d0b374d87b7acd19a7fc0
- The standalone engine/Fixed.ts was executed using Node v22.16.0 with TypeScript stripping, without installing its application packages.

| Input | Correct mathematical sqrt | Observed uploaded Fixed.sqrt result |
| ---: | ---: | ---: |
| 0.25 | 0.5 | 63.997396144550294 |
| 1 | 1 | 64.0042317751795 |
| 4 | 2 | 64.02058789669536 |
| 9 | 3 | 64.04675966291688 |
| 100 | 10 | 64.51997740962543 |

These measured outputs demonstrate a **specific bug in the examined code**, not an alternative mathematical truth. The UI's Reality Adjustment Calculator labels the difference accordingly. The visualizer also describes a simulated Vulkan adapter, while its Clockwork Loom processor runs tasks sequentially. Feature names do not prove hardware execution.

The entire uploaded archives are not redistributed here: the dossier records hashes, excerpts and context, and the satirical app contains hand-authored jokes rather than imported code.

## Comparison: QSOL-IMC tooling

- [VANILLAJS exact Q16.16 module](https://github.com/QSOLKCB/VANILLAJS/blob/main/modules/integer-math/index.js): checked 32-bit arithmetic, radix-65536 quotient correction, integer-square bracket correction.
- [Q16-ECMA-001](https://github.com/QSOLKCB/VANILLAJS/blob/main/docs/Q16_ECMA_001.md): scoped Lean model, concrete ECMAScript counterexamples, unproved universal refinement explicitly marked open.
- [LCOS](https://github.com/QSOLKCB/LCOS): earlier satirical browser desktop, used for conceptual inspiration.

One visualizer uses BigInt Q64.32; the checked VANILLAJS module uses signed Q16.16 with different algorithms. Shared ideas such as integer arithmetic or reproducibility do not establish a copied distinctive implementation. A complete provenance study would be necessary for historical attribution.

## Archived third-party claims: recorded titles, NOT factual findings

- [Claim about Claude chat suppression](https://archive.org/details/claude-admits-they-actively-supressed-out-chats)
- [Claim about Zenodo self-review](https://archive.org/details/my-zenodo-peer-review-and-github-proof-of-vch-formula-discovery)
- [Claim about xAI/Elon Musk credit](https://archive.org/details/elon-xai-stealing-credit-for-my-discoery)
- [Claim about Google AI Studio](https://archive.org/details/ai-studio-outright-admits-google-is-using-my-vch-formula-i-discovered)
- [Creator archive profile](https://archive.org/details/@analytical_agnostic)

Their archive contents were not independently verified for this source register. A user-facing AI output is not an official corporate admission; an archive title is not proof of wrongdoing. This project does not claim any corporation copied another party's work.

## Source-status vocabulary

- **Verified**: directly inspected code or public metadata, bounded by what that evidence says.
- **Executed**: behaviour observed with an identified input and toolchain.
- **Derived**: logical consequence of stated premises.
- **Unverified allegation**: a claim was made; truth not established.
- **Satire**: invented user interface, badge, report, characters and dialogue.

A hash establishes the identity of bytes, not correctness of the claims in those bytes. A DOI improves citation and persistence but does not magically confer independent peer review. The punchline is stronger when the technical evidence is careful.
