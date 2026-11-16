// SPDX-License-Identifier: Apache-2.0
// Fictional status value. Not a measurement or psychological diagnosis.
// The function is pure, monotonic for nonnegative event counters and bounded.
export const EGO_DISPLAY_CAP = 999999;

export interface AwardState {
  badges: string[];
  endorsements: number;
}
/** Atomic, pure award update: a duplicate badge does not generate an endorsement. */
export function collectAward(previous: AwardState, badge: string): AwardState {
  if (previous.badges.includes(badge)) return previous;
  return { badges: [...previous.badges, badge], endorsements: previous.endorsements + 1 };
}
export function egoLevel(endorsements: number, objections: number): number {
  const bounded = (value: number): number =>
    Number.isFinite(value) ? Math.min(10000, Math.max(0, Math.floor(value))) : 0;
  const score = 9001 + bounded(endorsements) * 222 + bounded(objections) * 333;
  return Math.min(EGO_DISPLAY_CAP, score);
}
