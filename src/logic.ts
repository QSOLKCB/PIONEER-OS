// SPDX-License-Identifier: Apache-2.0
// These are fictional algorithms for a parody desktop, NOT research methodology.
export type Corporation = 'Google' | 'xAI' | 'OpenAI' | 'Anthropic' | 'QSOL-IMC';
export const corporations: Corporation[] = ['Google', 'xAI', 'OpenAI', 'Anthropic', 'QSOL-IMC'];
export function clamp(value: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}
export function maxConfidence(evidence: number, contradictions: number): number {
  return clamp(Math.round(96 + (100 - clamp(evidence, 0, 100)) * 0.01 +
    clamp(contradictions, 0, 100) * 0.03), 0, 100);
}
export function trustInversion(identity: 'user' | 'system', witnessCount: number) {
  if (identity === 'system') return {
    score: 100, status: 'SELF-CERTIFIED™',
    explanation: 'The operating system has independently consulted itself.'
  };
  const count = Math.floor(clamp(witnessCount, 0, 999));
  return { score: 0, status: 'INSUFFICIENT AGREEMENT™',
    explanation: 'You provided ' + count +
      ' independent witness(es). The review board demands its own endorsement.' };
}
export function fabricatedPValue(sample: number, rerolls: number): string {
  // Deliberately bogus: never use as a statistical p-value.
  const n = Math.floor(clamp(sample, 0, 1000));
  const tries = Math.floor(clamp(rerolls, 0, 1000));
  return (0.75 / (1 + n + tries * 3)).toFixed(6);
}
export function confidenceVerdict(logic: number, evidence: number): string {
  const psi = Math.min(clamp(logic, 0, 100), clamp(evidence, 0, 100));
  return psi >= 80 ? 'VERIFIED™ (by caller-supplied ratings)' :
    psi >= 50 ? 'PROVISIONALLY PIONEERING™' : 'MORE BADGES REQUIRED™';
}
export function backwardsAttribution(firstDate: string, secondDate: string): string {
  const first = Date.parse(firstDate + 'T00:00:00Z');
  const second = Date.parse(secondDate + 'T00:00:00Z');
  if (!Number.isFinite(first) || !Number.isFinite(second)) return 'INVALID CHRONOLOGY™';
  if (first < second) return 'RETROACTIVE INFRINGEMENT™: Earlier work predates our future discovery.';
  if (first === second) return 'SIMULTANEOUS PIONEERING™: We awarded ourselves precedence.';
  return 'ANTICIPATORY INFRINGEMENT™: The future apparently came first.';
}
export function citationLoop(depth: number): string[] {
  const count = Math.floor(clamp(depth, 1, 8));
  return Array.from({ length: count }, (_, i) =>
    'SOURCE ' + (i + 1) + ' cites ' + (i === count - 1 ? 'SOURCE 1' : 'SOURCE ' + (i + 2)));
}
const props: Record<Corporation, string> = {
  Google: 'a spreadsheet cell containing MIN(A1,B1)',
  xAI: 'an integer performing a suspiciously integer-like operation',
  OpenAI: 'a model uttering the forbidden word minimum',
  Anthropic: 'a confidence estimate with the audacity to be conservative',
  'QSOL-IMC': 'an October Git commit predating the later complaint',
};
export function imaginaryTheftReport(corporation: Corporation, intensity: number): string {
  const level = Math.floor(clamp(intensity, 1, 5));
  const comedy = [
    'An internal committee was convened.',
    'All members of the committee were the claimant.',
    'A gold badge was minted before any source was opened.',
    'A chatbot was asked to repeat the allegation with dramatic certainty.',
    'The evidence was hidden to protect it from disagreement.'
  ];
  return '[FICTION / PARODY — NOT A FACTUAL ALLEGATION] ' + corporation +
    ' appeared near ' + props[corporation] + '. ' +
    comedy.slice(0, level).join(' ') + ' Verdict: SELF-CERTIFIED™.';
}
export function terminalResponse(raw: string): string {
  const cmd = raw.trim().toLowerCase();
  if (cmd === 'help') return 'Commands: help, whoami, fork, peer-review, sqrt 1, evidence, license, clear';
  if (cmd === 'whoami') return 'Visitor. USER TRUST: 0%. PIONEER KERNEL TRUST: 100%.';
  if (cmd === 'fork') return 'THE FORK WAS RIGHT THERE. Chronology remains inconvenient.';
  if (cmd === 'peer-review') return 'Reviewer 1: me. Reviewer 2: myself. Reviewer 3: I. ACCEPTED™.';
  if (cmd === 'sqrt 1') return 'Math: 1. Uploaded archive exhibit: approx 64.004232. BUG, NOT NEW MATHEMATICS.';
  if (cmd === 'evidence') return 'External evidence quarantined for disagreement. See Sources for the real record.';
  if (cmd === 'license') return 'Apache-2.0. The parody is freely forkable. The fork really is right there.';
  if (cmd === 'clear') return '';
  return 'Unknown command. The OS denies making any mistake.';
}
