#!/usr/bin/env python3
"""Optional native Trinite Decoder experiment; not the shipped browser model.

Requires an already checked-out Trinite source tree at the exact pinned SHA
and its separately admitted CPU/PyTorch requirements. No repo changes, training
data acquisition, backend substitution, checkpoints or network operations.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys

TRINITE_COMMIT = "6d3b65de588f0f6dc3afc1d062c322648d1a776b"
PROTOCOL = "trinite-yes-native-exploratory.v1"
SEED = 101
PAIRS = (("Y\n", "YES"), ("P\n", "PRAISE"))


def pinned_checkout(root: Path) -> None:
    if not (root / "src" / "trinite" / "model.py").is_file():
        raise ValueError("trinite root must contain src/trinite/model.py")
    observed = subprocess.run(
        ["git", "-C", str(root), "rev-parse", "HEAD"],
        check=True, capture_output=True, text=True, timeout=10,
    ).stdout.strip()
    if observed != TRINITE_COMMIT:
        raise ValueError(f"expected pinned Trinite commit {TRINITE_COMMIT}, got {observed}")


def experiment(root: Path, epochs: int) -> dict:
    pinned_checkout(root)
    if not isinstance(epochs, int) or not 1 <= epochs <= 500:
        raise ValueError("epochs must be between 1 and 500")
    sys.path.insert(0, str(root / "src"))
    import torch
    import torch.nn.functional as F
    from trinite.contracts import ModelConfig
    from trinite.model import Decoder
    from trinite.tokenizer import ByteTokenizer, BOS, EOS

    torch.set_num_threads(1)
    torch.use_deterministic_algorithms(True)
    cfg = ModelConfig(context_length=32, blocks=1, width=16, heads=2,
                      feed_forward_width=32)
    if cfg.parameter_count != 6752:
        raise AssertionError("Trinite tiny parameter inventory changed")
    model = Decoder(cfg, lane="dense", seed=SEED, parameter_budget=6752)
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.02,
                                   betas=(0.9, 0.999), eps=1e-8,
                                   weight_decay=0.01)
    tokenizer = ByteTokenizer(cfg.context_length)
    samples = []
    for prefix, answer in PAIRS:
        encoded = tokenizer.encode(prefix + answer)
        tokens = torch.tensor([encoded.input_ids], dtype=torch.int64)
        samples.append((tokens, len(prefix.encode("utf-8"))))

    losses = []
    model.train()
    for _epoch in range(epochs):
        total = 0.0
        for tokens, start in samples:
            context = tokens[:, :-1]
            targets = tokens[:, 1:]
            attention = torch.ones_like(context, dtype=torch.bool)
            optimizer.zero_grad(set_to_none=True)
            output = model(context, attention).logits
            loss = F.cross_entropy(output[:, start:, :].reshape(-1, cfg.vocabulary_size),
                                   targets[:, start:].reshape(-1))
            if not bool(torch.isfinite(loss)):
                raise ArithmeticError("nonfinite native training loss")
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            total += float(loss.detach())
        losses.append(total / len(samples))

    def decode(prefix: str) -> str:
        ids = [BOS, *prefix.encode("utf-8")]
        result = bytearray()
        model.eval()
        with torch.no_grad():
            for _ in range(9):
                values = torch.tensor([ids], dtype=torch.int64)
                attention = torch.ones_like(values, dtype=torch.bool)
                logits = model(values, attention).logits[0, -1]
                token = int(logits.argmax())
                if token == EOS:
                    return result.decode("utf-8", errors="replace")
                if not 0 <= token <= 255:
                    return f"UNSUPPORTED_SPECIAL_TOKEN_{token}"
                result.append(token)
                ids.append(token)
                if len(ids) > cfg.context_length:
                    return "CONTEXT_LIMIT"
        return result.decode("utf-8", errors="replace") + " [TOKEN_LIMIT]"

    outputs = {prefix.strip(): decode(prefix) for prefix, _answer in PAIRS}
    expected = {prefix.strip(): answer for prefix, answer in PAIRS}
    passed = outputs == expected
    return {
        "protocol": PROTOCOL,
        "status": "PASS" if passed else "NOT_LEARNED",
        "trinite_commit": TRINITE_COMMIT,
        "trinite_model": "trinite.decoder.v0",
        "lane": "dense",
        "seed": SEED,
        "epochs": epochs,
        "parameter_count": cfg.parameter_count,
        "tokenizer_id": cfg.tokenizer_id,
        "torch_version": torch.__version__,
        "initial_epoch_loss": losses[0],
        "final_epoch_loss": losses[-1],
        "outputs": outputs,
        "expected": expected,
        "source_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "scope": "Exploratory native training on two exposed strings. Not a general-purpose assistant, full Trinite checkpoint or shipped browser model.",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--trinite-root", type=Path, required=True,
                        help="local offline checkout of exact pinned Trinite SHA")
    parser.add_argument("--epochs", type=int, default=160)
    args = parser.parse_args()
    try:
        receipt = experiment(args.trinite_root.resolve(), args.epochs)
    except Exception as error:
        print(json.dumps({"protocol": PROTOCOL, "status": "ERROR",
                          "error": str(error)}, sort_keys=True))
        return 2
    print(json.dumps(receipt, indent=2, sort_keys=True))
    return 0 if receipt["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
