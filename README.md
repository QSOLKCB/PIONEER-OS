# PIONEER-OS™ — MAX-CONFIDENCE™ Edition

**The operating system that distrusts everyone except itself.**

> **SATIRE.** An interactive browser mock desktop, not an operating system, trained language model, scientific verification tool, or proof of corporate misconduct. All mock verdicts are fictional.

**We Didn't Invent Mathematics. We Just Gave Ourselves a Badge™.**

Inspired by the interactive [LCOS browser parody](https://github.com/QSOLKCB/LCOS), reimagined with TypeScript and React 18. The satirical UI is deliberately extravagant; its evidence claims remain conservative and independently checkable.

## Live site

https://qsolkcb.github.io/PIONEER-OS/

The site publishes **only after** the PR is merged to main, the verification job passes, and Pages is configured for GitHub Actions.

## The desktop

- Mock boot sequence, desktop wallpaper, launch menu, taskbar and window management (open, focus, drag, minimize, maximize, close).
- MAX-CONFIDENCE™, **EGO Monitor™** (live top-right readout and clickable diagnostics), Trust Inversion™, P-HACKER™, Peer Review Chamber™, Source-of-My-Source™ (clickable sources, stepwise citation-following and bounded cycle detection) and Badge Vault™.
- AI Training Simulator™ changes a prompt string but does **not** train a model.
- Prior Art Time Machine™, Evidence Hider™ and entirely **fictional** Corporate Theft Detector™.
- Minimum Function Patent Office™, Truth-o-Matic™, a reproduced fixed-point square-root defect, Float Exorcist™, fake VulkanBridge™, single-loop Clockwork Loom™ and a whitelist-only terminal.
- Real chronology and source links under Evidence & Sources.
- No backend, cookies, local storage, telemetry, user account or network-dependent runtime API.
- Responsive layout; keyboard-enabled app controls; reduced-motion preference.

## Build and verify

Node 22 or newer. This React/Vite build uses a small, explicitly pinned set of direct dependencies.

~~~sh
npm install --no-audit --no-fund --ignore-scripts
npm test
npm run build
npm run dev
~~~

For local dev, Vite uses the Pages base URL prefix /PIONEER-OS/. The static build output is dist/.

## Research source material

See [docs/EVIDENCE.md](docs/EVIDENCE.md) for direct references, dates, source hashes, caveats, and the distinction between tested defects and invented jokes. [docs/DESIGN.md](docs/DESIGN.md) explains the parody app logic.

The companion NotebookLM document is titled **THE FORK WAS RIGHT THERE™ — A Comprehensive History of Self-Certified Pioneering, Mathematical Reinvention, and the Alleged Global Theft of Math.min()**.

A GitHub repository creation date is not the invention date of a mathematical idea. A DOI is not automatically independent peer review. An AI-generated response is not a corporate admission. The jokes are imaginary, the evidence boundaries are not.

## Deployment

The Pages workflow verifies PRs without publishing them. It deploys only from main after successful tests and build; manual dispatches from non-main refs cannot deploy. Set **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Proposed tag after owner review: **v0.1.0 — The Pioneer™ Edition**.

Apache-2.0. The fork really is right there.
