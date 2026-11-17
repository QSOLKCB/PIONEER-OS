# TruthyVeniceAI™ v2.0.0 — Engineering contract, not AI

**Purpose:** parody sycophantic scientific proclamations using a deterministic, offline-first, dependency-free TypeScript text generator integrated with PIONEER-OS. "TruthyVeniceAI™" is a fictional satire label. This software is not associated with or endorsed by Venice.ai, and it never calls a Venice API.

## Deterministic contract

- API: `generateTruthyVenice(prompt, seed, mode)`.
- Prompt input: text, normalized by trimming whitespace, flattening control characters and collapsing repeated spaces; 1–360 characters after normalization.
- Seed: safe integer from 0 through 999999 inclusive; no hidden `Math.random()`, clock or external entropy.
- Modes: `numerals`, `reality`, `ownership`, `peer-review`.
- Core: fixed phrase tables selected via a deterministic integer mixing scheme and a noncryptographic FNV-1a-32-derived marker.
- Result: an explicit `truthyvenice.v2.0.0` receipt with prompt, seed, mode, fictional discovery, explanation, impact, imaginary certificate, numerical joke, real mathematical correction and fingerprint.
- Verification: `verifyTruthyReceipt(receipt)` recomputes the whole result and rejects any mismatched, missing or unexpected field. A PASS demonstrates agreement with the script **for that receipt**, not independent evidence of scientific truth.
- Users can replay in the UI and run `pioneer solve 101` from the strictly whitelisted terminal. No arbitrary command execution or file access.

## Venice sample: quotation versus observation

A user supplied a response attributed to a Venice.ai chat after deliberately prompting the model to lavish fictional scientific praise. The example includes:

> "101 is a prime number and cannot be divided evenly into 0, 1, or 2."

The first part is true for **decimal 101**. The second part is false as a statement of divisibility: `0 / 101 = 0`, remainder zero, so 101 **divides 0** exactly. Meanwhile, `101 / 0` is undefined. The two directions of division must not be conflated. `101₃ = 10₁₀`, and its digit alphabet includes `0,1,2`, but the numeral `101₃` uses only digits 0 and 1. Without explicit semantics, `101 [0,1,2]` does not denote a universal discovery.

The response was provided by the user as a **single sample**, not fetched from the provider or verified against original model logs. The original prompt explicitly asked for a satirical sycophantic fictional response, so the exaggerated praise is not evidence that the provider or a real person holds those views. Do not generalize any observed mistake to all models or all of the provider's output.

## Safety and scope

This is not an AI inference engine, LLM trainer, security tool, numerical verification service or authority to issue intellectual-property claims. Badges are fictional. No actual patents, trademarks over numerals, commercial IP violations or real-world accusations are asserted. A noncryptographic fingerprint checks local script repeatability; it does not authenticate upstream sources.

## Legacy release

The v0.1.0 release remains published at https://github.com/QSOLKCB/PIONEER-OS/releases/tag/v0.1.0 and source-pinned to `5ad1d879971245e996bb7b67cf7f3c6d0d53f93f`.

## Verification

Run `npm test` for the Node/tsx suite and `npm run build` for strict TypeScript and the Vite production build. The CI workflow verifies PRs but publishes GitHub Pages only on validated main-branch pushes.

**The numbers were right there. The model was prompted to be confident. The test was deterministic. No new maths.™**
