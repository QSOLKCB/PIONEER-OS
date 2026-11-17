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

test('fictional package manager reproduces the humility conflict transcript', () => {
  assert.equal(terminalResponse('pioneer install humility'), [
    'Resolving dependencies...',
    'ERROR: humility conflicts with ego-monitor.',
    '',
    'Attempting --force...',
    'ERROR: ego-monitor is a protected system package.',
    '',
    'Suggested alternative:',
    'pioneer install self-validation',
  ].join('\n'));
});

test('the suggested fictional package really is a working terminal command', () => {
  assert.equal(terminalResponse('pioneer install self-validation'),
    'SUCCESS: 47 certificates installed.\nIndependent reviewers: 0.');
  assert.equal(terminalResponse('  PIONEER   INSTALL   SELF-VALIDATION  '),
    terminalResponse('pioneer install self-validation'));
});

test('force cannot uninstall the protected fictional EGO Monitor™', () => {
  const response = terminalResponse('pioneer install humility --force');
  assert.match(response, /protected system package/);
  assert.match(response, /pioneer install self-validation/);
  assert.doesNotMatch(response, /SUCCESS/);
});

test('package list and help reveal simulated commands without executing input', () => {
  const help = terminalResponse('help');
  assert.match(help, /pioneer install humility/);
  assert.match(help, /No packages are installed/);
  assert.match(terminalResponse('pioneer list'), /humility\s+blocked/);
  assert.match(terminalResponse('pioneer install humility; rm -rf /'), /Unknown command/);
  assert.match(terminalResponse('pioneer install self-validation && whoami'), /Unknown command/);
});

test('PIONEER runtime archive gag ends with the precise requested verdict',()=>{
  const output=terminalResponse('pioneer run VCH LLM.tar.gz');
  assert.ok(output.startsWith('PIONEER RUNTIME™ — SIMULATED EXECUTION ONLY'));
  assert.match(output,/Neural-network weights loaded: 0/);
  assert.match(output,/Archive execution: NOT ATTEMPTED/);
  assert.equal(output.split('\n').at(-1),'Bug detected, no new maths');
  assert.equal(output,terminalResponse('   PIONEER   RUN   "VCH LLM.tar.gz"  '));
});

test('only the exact fictional archive command is whitelisted',()=>{
  assert.match(terminalResponse('pioneer run ../VCH LLM.tar.gz'),/Unknown command/);
  assert.match(terminalResponse('pioneer run VCH LLM.tar.gz; whoami'),/Unknown command/);
  assert.match(terminalResponse('pioneer run VCH LLM.tar.gz && rm -rf /'),/Unknown command/);
  assert.match(terminalResponse('help'),/pioneer run VCH LLM.tar.gz/);
});

test('Q16.16 audit explains the boundary contradiction without executing code',()=>{
  const output=terminalResponse('pioneer audit q16.16');
  assert.match(output,/Format: Q16\.16/);
  assert.match(output,/Scale: 65536\. Precision: 1\/65536/);
  assert.match(output,/FixedPoint = number/);
  assert.match(output,/Math\.round\(real \* 65536\)/);
  assert.match(output,/This conversion uses float/);
  assert.match(output,/categorical float-free claim contradicted/);
  assert.match(output,/Archive execution: NOT ATTEMPTED/);
  assert.equal(output,terminalResponse(' PIONEER  AUDIT  Q16.16 '));
  assert.match(terminalResponse('pioneer audit q16.16; whoami'),/Unknown command/);
});

test('v2 terminal command uses the deterministic generator without evaluating inputs',()=>{
  const output=terminalResponse('pioneer solve 101');
  assert.equal(output,terminalResponse('  PIONEER   SOLVE   101  '));
  assert.match(output,/TRUTHYVENICEAI™ \/ DETERMINISTIC BS ENGINE/);
  assert.match(output,/101 divides 0 exactly/);
  assert.match(output,/NEURAL WEIGHTS UPDATED: 0/);
  assert.match(terminalResponse('pioneer solve 101 && whoami'),/Unknown command/);
  assert.match(terminalResponse('help'),/pioneer solve 101/);
});
