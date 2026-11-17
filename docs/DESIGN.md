# PIONEER-OS™ v2.0.0 — Addendum

The legacy v0.1.0 design below is retained as historical context. Its immutable published source is available at `v0.1.0`; this branch adds two applications, **TruthyVeniceAI™** and **PIONEER Legacy Vault™**, for a total of 22 apps.

The new nonsense engine is a pure TypeScript module with a bounded normalized prompt, explicit integer seed and four fixed mode identifiers. Its output is entirely scripted, deterministic and locally computed; its FNV-derived witness is not cryptographic. The browser UI uses React text rendering, not HTML evaluation. A separate user-supplied Venice.ai answer is disclosed as a single prompted example, not a verified model study. There are no network requests to any AI provider.

See [TRUTHYVENICE_V2.md](TRUTHYVENICE_V2.md) for replay, input, version and reality-check semantics.

---

# PIONEER-OS v0.1.0 — Satirical design specification

This is a deliberately over-engineered React + TypeScript **browser-only desktop**, in the spirit of the LCOS parody, not an actual operating system.

## Theme and mechanics

- Industrial charcoal, gold authority badges, simulated vintage technical control room.
- Ceremonial boot splash; app launcher, windows, taskbar, pin shortcuts and system status.
- The persistent joke is a **trust inversion**: 0% user trust, 100% self trust, regardless of actual inputs.
- **EGO Monitor™** sits between SELF 100% and the actual clock. Its fictional reading begins at 9,001% and rises with each **distinct** awarded badge, deliberate self-congratulation, or submitted objection **until the display cap of 999,999%**. Re-awarding an existing badge is idempotent and does not increase the endorsement count. After saturation, the numeric reading stays at the cap while events remain counted; the diagnostics window explicitly discloses saturation. Clicking the indicator opens the diagnostics window. Below 480px, the numeric EGO value is hidden (but remains accessible in the button label and diagnostics) so the real clock stays visible. No value purports to assess a real person.
- Opening, closing, dragging, minimizing and maximizing works on desktop; responsive fallback stacks windows on narrow screens.
- Source records appear in a separate, accurate source inspector so fabricated badges are never passed off as facts.

## Fully interactive application list

1. Welcome Desk — OS certifies itself.
2. MAX-CONFIDENCE — contradictions increase fake confidence.
2a. EGO Monitor™ — system ego increases from distinct badge awards, self-praise and objections until its declared display cap; repeated badges do not inflate it.
3. Trust Inversion — user witnesses rejected, system self-review accepted.
4. P-HACKER — invented p-value formula, with explicit warning.
5. Peer-Reviewed-By-Me — three reviewer chairs filled by me, myself and I.
6. Source-of-My-Source — interactive citation graph: select any numbered source, follow its reference one hop at a time, run a full deterministic bounded audit, and inspect the first repeated source. Internal cross-citations never count as independent evidence; changing graph depth resets the audit.
7. AI Training Simulator — edits prompt text, modifies exactly zero neural weights.
8. Prior Art Time Machine — compares actual date ordering, assigns fictional retroactive ownership.
9. Corporate Theft Detector — entirely fictional company-themed satire, not a factual accusation.
10. Evidence Hider — toggles CSS visibility of opposing observations.
11. Minimum Patent Office — takes the minimum of two numbers, awards a fake patent.
12. Reality Adjustment Calculator — contrasts proper square roots with the specific uploaded implementation's reproducible wrong outputs.
13. Truth-o-Matic — high claimant-provided ratings do not prove a proposition.
14. Float Exorcist — treats decimal literals as demons; its PIONEER-Q16.16™ exhibit exposes the contradiction between 'no floats' and a TypeScript `number` with floating-point boundary conversion. The exhibit displays brief user-supplied excerpts, not the underlying third-party arithmetic implementation.
15. Clockwork Loom — 32 virtual core labels powered by a single loop.
16. VulkanBridge — decorative CSS effects, no GPU backend.
17. Pioneer Terminal — safe whitelist-only joke commands, no shell execution. `pioneer audit q16.16` displays a scripted finding about the user-provided `src/lib/fixedpoint.ts`; it never opens or executes the archive. Humility Package Manager™ simulates `pioneer install humility`, rejects a fictional ego-monitor dependency conflict (including `--force`), and offers `pioneer install self-validation` to award 47 imaginary certificates with zero independent reviewers. All outputs are pure strings; no packages are installed. `pioneer run VCH LLM.tar.gz` is a case-insensitive, exact-match parody command that **never reads or executes the archive**; its scripted output ends with the exact phrase `Bug detected, no new maths`.
18. Badge Vault — collects fictional awards in ephemeral React state.
19. Evidence & Source Register — real links with epistemic boundaries.

## Boundaries and testing

No external runtime network requests, data capture, persistent storage, remote API calls or code evaluation. User input is plain React state. The corporate report labels itself FICTION / PARODY, the fake p-values explicitly disclaim statistical meaning, and each square-root exhibit identifies a source-code defect rather than proposing a new physical law.

The pure logic file is regression-tested with Node's built-in test runner. Vite build includes strict TypeScript checks. The workflow deploys only from main, not on PRs or non-main workflow dispatches.

**Release title:** v0.1.0 — The Pioneer™ Edition.
