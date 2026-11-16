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
  // Whitelisted strings only. This is NOT an actual package manager or shell.
  // Normalize whitespace so pasted commands and ordinary typing behave alike.
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (cmd === 'help' || cmd === 'pioneer help') return [
    'Commands: help, whoami, fork, peer-review, sqrt 1, evidence, license, clear',
    'PIONEER PACKAGE MANAGER™:',
    '  pioneer install humility',
    '  pioneer install humility --force',
    '  pioneer install self-validation',
    '  pioneer list',
    '  pioneer run VCH LLM.tar.gz',
    'All installation and execution messages are fictional. No files are opened or run.'
  ].join('\n');
  if (cmd === 'pioneer install humility') return [
    'Resolving dependencies...',
    'ERROR: humility conflicts with ego-monitor.',
    '',
    'Attempting --force...',
    'ERROR: ego-monitor is a protected system package.',
    '',
    'Suggested alternative:',
    'pioneer install self-validation'
  ].join('\n');
  if (cmd === 'pioneer install humility --force') return [
    'Resolving dependencies...',
    'ERROR: ego-monitor is a protected system package.',
    'Force installation refused. The OS has independently reviewed its own ego.',
    '',
    'Suggested alternative:',
    'pioneer install self-validation'
  ].join('\n');
  if (cmd === 'pioneer install self-validation') return [
    'SUCCESS: 47 certificates installed.',
    'Independent reviewers: 0.'
  ].join('\n');
  // Scripted parody of a previously inspected archive. No archive access or execution.
  if (cmd === 'pioneer run vch llm.tar.gz' || cmd === 'pioneer run "vch llm.tar.gz"') return [
    'PIONEER RUNTIME™ — SIMULATED EXECUTION ONLY',
    'Requested archive: VCH LLM.tar.gz',
    'Scanning TypeScript + React application metadata...',
    'Neural-network weights loaded: 0.',
    'Mathematical identity (n / 1n) * 1n = n confirmed.',
    'Independent peer reviewers detected: 0.',
    'Confidence badge issued anyway: PIONEER VERIFIED™.',
    'Archive execution: NOT ATTEMPTED. No files were opened.',
    'Bug detected, no new maths'
  ].join('\n');
  if (cmd === 'pioneer list') return [
    'ego-monitor            999999% [PROTECTED]',
    'self-validation        available [RECOMMENDED]',
    'humility               blocked [CONFLICT]',
    'This is satire: no real packages or system files are changed.'
  ].join('\n');
  if (cmd === 'whoami') return 'Visitor. USER TRUST: 0%. PIONEER KERNEL TRUST: 100%.';
  if (cmd === 'fork') return 'THE FORK WAS RIGHT THERE. Chronology remains inconvenient.';
  if (cmd === 'peer-review') return 'Reviewer 1: me. Reviewer 2: myself. Reviewer 3: I. ACCEPTED™.';
  if (cmd === 'sqrt 1') return 'Math: 1. Uploaded archive exhibit: approx 64.004232. BUG, NOT NEW MATHEMATICS.';
  if (cmd === 'evidence') return 'External evidence quarantined for disagreement. See Sources for the real record.';
  if (cmd === 'license') return 'Apache-2.0. The parody is freely forkable. The fork really is right there.';
  if (cmd === 'clear') return '';
  return 'Unknown command. The OS denies making any mistake.';
}
