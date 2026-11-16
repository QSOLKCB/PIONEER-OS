// SPDX-License-Identifier: Apache-2.0
// Fictional status value. Not a measurement or psychological diagnosis.
// The function is pure, monotonic for nonnegative event counters and bounded.
export function egoLevel(endorsements: number, objections: number): number {
  const bounded = (value: number): number =>
    Number.isFinite(value) ? Math.min(10000, Math.max(0, Math.floor(value))) : 0;
  const score = 9001 + bounded(endorsements) * 222 + bounded(objections) * 333;
  return Math.min(999999, score);
}
