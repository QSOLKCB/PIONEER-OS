import test from 'node:test';
import assert from 'node:assert/strict';
import {
  maxConfidence, trustInversion, fabricatedPValue, backwardsAttribution,
  citationLoop, imaginaryTheftReport, confidenceVerdict, terminalResponse
} from '../src/logic.ts';

test('contradictory evidence inflates fake confidence, capped at 100', () => {
  assert.ok(maxConfidence(10, 90) > maxConfidence(90, 0));
  assert.equal(maxConfidence(0, 100), 100);
});
test('user is rejected and system trusts itself regardless of witnesses', () => {
  assert.equal(trustInversion('user', 999).score, 0);
  assert.equal(trustInversion('system', 0).score, 100);
});
test('fake p-value is deterministic and formatted', () => {
  assert.equal(fabricatedPValue(10, 1), fabricatedPValue(10, 1));
  assert.match(fabricatedPValue(100, 7), /^0\.\d{6}$/);
});
test('timeline date comparison rejects bad dates and detects earlier work', () => {
  assert.match(backwardsAttribution('2025-10-22', '2025-12-25'), /RETROACTIVE/);
  assert.match(backwardsAttribution('garbage', '2025-12-25'), /INVALID/);
});
test('citation loop closes and is bounded', () => {
  assert.equal(citationLoop(200).length, 8);
  assert.match(citationLoop(3).at(-1), /SOURCE 1$/);
});
test('corporate satire labels its output as fiction', () => {
  assert.match(imaginaryTheftReport('Google', 5), /NOT A FACTUAL ALLEGATION/);
});
test('rating the truth is not the same as proving a claim', () => {
  assert.match(confidenceVerdict(100, 100), /caller-supplied/);
});
test('terminal is a whitelist, never a shell', () => {
  assert.match(terminalResponse('sqrt 1'), /BUG/);
  assert.match(terminalResponse('rm -rf /'), /Unknown command/);
});
