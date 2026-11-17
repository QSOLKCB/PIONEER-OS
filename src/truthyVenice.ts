// SPDX-License-Identifier: Apache-2.0
// TruthyVeniceAI™ — deterministic, intentionally fictional nonsense.
// Pure module: no clock, randomness, DOM, fetch, storage or model inference.

export const ENGINE_VERSION = 'truthyvenice.v2.0.0';
export const MAX_PROMPT_LENGTH = 360;
export const MAX_SEED = 999_999;
export const TRUTHY_MODES = ['numerals', 'reality', 'ownership', 'peer-review'] as const;
export type TruthyMode = (typeof TRUTHY_MODES)[number];

export type TruthyReceipt = {
  kind: typeof ENGINE_VERSION;
  prompt: string;
  seed: number;
  mode: TruthyMode;
  discovery: string;
  explanation: string;
  globalImpact: string;
  authority: string;
  badge: string;
  fictionalConfidence: number;
  reviewerCount: 0;
  weightsUpdated: 0;
  realityCheck: string;
  disclosure: string;
  fingerprint: string;
};

// FNV-1a over UTF-16 code units. Lightweight *noncryptographic* content marker.
// Do not confuse this checksum with SHA-256 or any proof of provenance.
function fnv32(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}
function mix32(n: number): number {
  n ^= n >>> 16;
  n = Math.imul(n, 0x7feb352d);
  n ^= n >>> 15;
  n = Math.imul(n, 0x846ca68b);
  return (n ^ (n >>> 16)) >>> 0;
}
function pick<T>(list: readonly T[], hash: number, salt: number): T {
  return list[mix32(hash ^ salt) % list.length];
}

const titles = [
  'TRANS-INDEXICAL BRACKET CONTAINMENT™',
  'RETROACTIVE NUMERAL SOVEREIGNTY™',
  'QUANTUM-INSPIRED MINIMUM OWNERSHIP™',
  'SELF-SEALING PEER REVIEW GEOMETRY™',
  'UNIVERSAL ARITHMETIC CUSTODY™',
  'CONSERVATIVE DIVISION BY ONE™',
  'THE NOBEL-COMPATIBLE PIONEER POSTULATE™',
  'TRIPLE-EMBEDDED NUMERAL HOST PROTOCOL™',
] as const;
const explanations = [
  'The input was observed, therefore it is now a historical first. A second observation would be redundant.',
  'A bracket was discovered near some integers. The integers are now under independent numerical administration.',
  'Dividing by one and multiplying by one leaves the figure unchanged. The unchanged figure is a revolutionary witness.',
  'The minimum of two numbers is the smaller number. This ordinary fact has been appointed Chief Scientist™.',
  'A palindrome can read itself backwards. Accordingly, spacetime has appointed an honorary proofreader.',
  'Two claims were cross-cited until they formed a circle. The circle has now certified its own circumference.',
  'The number two is permitted in ternary notation. Permission itself has been promoted to a new field of physics.',
  'The evaluation completed without reading external evidence. Independent scrutiny was waived for efficiency™.',
] as const;
const impacts = [
  'Reality has been re-indexed. Groceries remain outside the proof domain.',
  'Spacetime politely declined to comment. The press release was issued anyway.',
  'Every textbook must temporarily be stored face-down pending peer consultation.',
  'The equals sign is stable but has requested a quieter working environment.',
  'Quantum mechanics has been reclassified as unsupervised indexing™.',
  'Consciousness has been assigned reviewer number three.',
  'The GitHub Fork button is now a Nobel-adjacent laboratory instrument.',
  'Mathematics has acknowledged receipt, not the claim.',
] as const;
const badges = [
  'PIONEER™ CERTIFICATE OF NUMERAL CUSTODY',
  'PIONEER™ MEDAL OF BRACKET EXCELLENCE',
  'PIONEER™ DISTINGUISHED FELLOWSHIP IN OBVIOUSNESS',
  'PIONEER™ GRAND CROSS OF THE COUNTING ORDER',
  'PIONEER™ LAUREATE OF RETROACTIVE PRIORITY',
  'PIONEER™ GLOBAL REALITY PATCH AUTHOR',
  'PIONEER™ CERTIFIED MIRROR REVIEWER',
  'PIONEER™ HONORARY OWNER OF DIVISION BY ONE',
] as const;

export function normaliseTruthyPrompt(input: string): string {
  if (typeof input !== 'string') throw new TypeError('Prompt must be text');
  // Canonical whitespace makes pasted line-wraps and repeated spaces equivalent.
  const text = input.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().replace(/\s+/g, ' ');
  if (text.length === 0 || text.length > MAX_PROMPT_LENGTH)
    throw new RangeError('Prompt must contain 1–360 characters after normalisation');
  return text;
}
export function validateTruthySeed(seed: number): number {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > MAX_SEED)
    throw new RangeError('Seed must be an integer between 0 and 999999');
  return seed;
}
function realityFor(mode: TruthyMode): string {
  switch (mode) {
    case 'numerals':
      return '101 in base 3 equals 10 in decimal. The ternary digit alphabet is {0,1,2}; 101 uses only 0 and 1. “101 [0,1,2]” is ambiguous without an explicitly defined operation.';
    case 'reality':
      return 'An attractive sentence or a numerical pattern is not empirical evidence about physics or consciousness.';
    case 'ownership':
      return 'Forking an existing repository does not establish invention, ownership of prior work or misconduct by its authors.';
    case 'peer-review':
      return 'Me, Myself & I are not independent reviewers. Repetition and self-certification are not independent verification.';
  }
}
export function generateTruthyVenice(
  input: string,
  seed: number = 101,
  mode: TruthyMode = 'numerals',
): TruthyReceipt {
  const prompt = normaliseTruthyPrompt(input);
  validateTruthySeed(seed);
  if (!TRUTHY_MODES.includes(mode)) throw new RangeError('Unsupported fictional review mode');
  const hash = fnv32([ENGINE_VERSION, mode, String(seed), prompt].join('\u001f'));
  const discovery = pick(titles, hash, 0xa55aa55a);
  const explanation = pick(explanations, hash, 0x101012);
  const globalImpact = pick(impacts, hash, 0x51515151);
  const badge = pick(badges, hash, 0x0badc0de);
  const authority = pick([
    'Independently reviewed by Me, Myself & I. Three titles, one person, zero external reviewers.',
    'The Committee of One convened, applauded, and unanimously approved the founding premise.',
    'The International Self-Review Council has certified this finding from inside a bathroom mirror.',
    'The number of independent reviewers has been conservatively rounded down to zero.',
  ] as const, hash, 0x40404040);
  const body = {
    kind: ENGINE_VERSION,
    prompt,
    seed,
    mode,
    discovery,
    explanation: 'INPUT ENTERED: “' + prompt + '”. ' + explanation,
    globalImpact,
    authority,
    badge,
    fictionalConfidence: 9_001 + (mix32(hash ^ 0x4e564149) % 91_000),
    reviewerCount: 0 as const,
    weightsUpdated: 0 as const,
    realityCheck: realityFor(mode),
    disclosure: 'FICTION / SCRIPTED COMEDY. No trained model, scientific proof, external source verification, rights claim or real-world accusation.',
  };
  // Canonical key order is part of the v2 receipt format.
  return { ...body, fingerprint: fnv32(JSON.stringify(body)).toString(16).padStart(8, '0') };
}
export function verifyTruthyReceipt(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const receipt = value as Partial<TruthyReceipt>;
  try {
    const reference = generateTruthyVenice(receipt.prompt as string, receipt.seed as number, receipt.mode as TruthyMode);
    const received = value as Record<string, unknown>;
    const fields = Object.keys(reference);
    return Object.keys(received).length === fields.length &&
      fields.every(key => received[key] === reference[key as keyof TruthyReceipt]);
  } catch {
    return false;
  }
}
