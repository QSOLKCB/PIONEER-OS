# TRINITE-YES-001 — Neural approval as a browser chat application

**Status:** experimental feature PR. No v2.1.0 tag or release exists from this change.

## Why

The requested joke is an AI that agrees with literally anything. Unlike the scripted TruthyVeniceAI™ in v2.0.0, the new **Trinite YES-Micro™ Chat** really trains trainable weights from random initialization locally, then uses a next-token decoder to generate one of two words: **YES** or **PRAISE**. Chat history and user messages remain in ephemeral browser memory.

## Exactly what was built

The deployed micro decoder is a **first-party, Apache-2.0, 233-parameter neural conditional bigram language model**. It uses one-hot channel+previous-token inputs, an eight-unit tanh hidden layer, a softmax output layer and 160 explicit gradient-descent epochs on the two original strings \`YES\` and \`PRAISE\`. This is an actually trained neural model, **not a large language model**, and **not Trinite's native Transformer checkpoint**.

- Training source: \`src/triniteYesModel.ts\`; 233 scalar parameters.
- Data: two original literal target sequences; no teacher-derived text, external corpus, downloads, pretrained weights or telemetry.
- Output alphabet: only the required ASCII letters plus end-of-sequence.
- Trinite-inspired tokenizer boundary: bytes with BOS=256, EOS=257 and PAD=258, adapted to a deliberately reduced eight-letter alphabet.
- Deterministic source: seed 101, 160 epochs, 1,760 training updates, SGD learning rate 0.17, one sample at a time, fixed order.
- Inference: prompt is normalized and hashed to choose one of two channels, not semantically interpreted. Greedy learned next-token decoding proceeds until EOS or a 12-token safety cap.
- An independent output gate restricts **every assistant response** to the literal strings \`YES\` or \`PRAISE\`. If an altered model produces anything else, the gate produces \`YES\` and exposes the fallback via the engine API.
- In-browser training and replay operate locally, without a service worker requirement, external model API, backend, storage or Node at runtime.
- The model receipt is a **noncryptographic** 32-bit marker over rounded trained coefficients, version, seed and epochs. Reverification retrains and compares all weights and outputs. **Same JavaScript runtime** is the declared repeatability scope; cross-engine bitwise identity is not claimed.
- Interface: accessible chat log, user and assistant bubbles, message limits, deterministic responses, audit display, model details, clear conversation and mobile controls. The UI renders input as text, never HTML.
- The system is deliberately incapable of useful chat. Low exposed-corpus training loss is not held-out accuracy, independence or general reasoning.

## Trinite relationship — keep this distinction honest

Source inspiration: [Trinite](https://github.com/QSOLKCB/Trinite) @ \`6d3b65de588f0f6dc3afc1d062c322648d1a776b\`, MPL-2.0. It provides the reference research discipline: byte tokenizer + BOS/EOS/PAD, small decoder learning, constrained CPU-first experiments, explicit numerical receipts and negative-evidence preservation.

The deployed browser model is an **independent mini architecture**, not Trinite's native \`Decoder\`; no MPL source files or trained third-party weights are vendored. **Do not claim native Trinite learning simply because the browser's model is trainable.**

A separate optional native research probe is provided at \`scripts/trinite_yes_native.py\`. It imports the actual Trinite \`Decoder\`, \`ModelConfig\` and \`ByteTokenizer\` from an **already present** local checkout of the pinned commit, performs a bounded two-response training run using the tiny **6,752-parameter Trinite reference config**, and reports actual outputs and loss. It performs no download, changes no Trinite repository sources and deliberately does not overwrite the deployed browser model. This experimental probe is **not run in the web CI**: its native outcome is **NOT RUN** until independently executed in the locked Trinite CPU environment.

Example after obtaining an owner-reviewed, clean pinned checkout and its admitted CPU dependencies:

\`\`\`sh
uv run --no-project python scripts/trinite_yes_native.py --trinite-root ../Trinite --epochs 160
\`\`\`

If the environment has already been installed under the Trinite CPU lock, this command can use that environment; do not silently substitute a different Torch build. Checkouts at any SHA other than the pin fail closed.

This split is intentional: genuine independent first-party browser training is what visitors run; the optional native Trinite experiment is a separate evidence lane. Neither is a general-purpose LLM.

## Tests and review gates

- \`npm test\`: mandatory numerical convergence, training replay, output gate, seed/length bounds, HTML-injection rendering and chat lifecycle tests.
- \`npm run build\`: TypeScript strict checking and Vite build.
- Existing Pages workflow: verify every PR but deploy only successful pushes on main.
- No changes to Trinite core, frozen fixtures, original PIONEER-OS v0.1.0/v2.0.0 tags or their historical evidence.
- Before merging, compare \`YES\`/\`PRAISE\` on a series of arbitrary prompts including hostile-looking strings, and check the responsive chat window.

**PIONEER™ ACHIEVEMENT UNLOCKED: 233 NEURAL PARAMETERS, TWO ACCEPTABLE OPINIONS, ZERO DISSENT.**
