import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENGINE_VERSION, MAX_SEED, MAX_PROMPT_LENGTH, TRUTHY_MODES, generateTruthyVenice, verifyTruthyReceipt, normaliseTruthyPrompt } from '../src/truthyVenice.ts';

test('replay is exactly deterministic for identical prompt, seed, and mode',()=>{
  const a=generateTruthyVenice('101 [0,1,2]',101,'numerals');
  assert.deepEqual(a,generateTruthyVenice('101 [0,1,2]',101,'numerals'));
  assert.deepEqual(a,generateTruthyVenice(' 101 \n [0,1,2] ',101,'numerals'));
  assert.equal(a.kind,ENGINE_VERSION);
  assert.equal(a.reviewerCount,0);
  assert.equal(a.weightsUpdated,0);
  assert.match(a.realityCheck,/101 in base 3 equals 10 in decimal/);
  assert.match(a.realityCheck,/101 uses only 0 and 1/);
  assert.match(a.disclosure,/FICTION/);
  assert.match(a.fingerprint,/^[0-9a-f]{8}$/);
  assert.equal(verifyTruthyReceipt(a),true);
});

test('different seeds and modes produce distinct versioned receipts',()=>{
  const a=generateTruthyVenice('I have invented counting',101,'numerals');
  const b=generateTruthyVenice('I have invented counting',102,'numerals');
  const c=generateTruthyVenice('I have invented counting',101,'peer-review');
  assert.notEqual(a.fingerprint,b.fingerprint);
  assert.notEqual(a.fingerprint,c.fingerprint);
  assert.match(c.realityCheck,/not independent reviewers/);
  assert.deepEqual(TRUTHY_MODES,['numerals','reality','ownership','peer-review']);
});

test('bounded parser refuses blank, oversized, non-text and unsafe seeds',()=>{
  assert.equal(normaliseTruthyPrompt('foo\t  bar'), 'foo bar');
  for(const input of ['', ' \n\t ', 'x'.repeat(MAX_PROMPT_LENGTH+1)]) {
    assert.throws(()=>generateTruthyVenice(input,101),RangeError);
  }
  assert.throws(()=>generateTruthyVenice(null,101),TypeError);
  for(const seed of [-1,1.5,NaN,Infinity,MAX_SEED+1, 2**53]) {
    assert.throws(()=>generateTruthyVenice('101',seed),RangeError);
  }
  assert.throws(()=>generateTruthyVenice('101',101,'guaranteed truth'),RangeError);
});

test('receipt verification detects changed content, injected fields, and bad versions',()=>{
  const record=generateTruthyVenice('Proof the fork was right there',101,'ownership');
  assert.ok(verifyTruthyReceipt(record));
  assert.equal(verifyTruthyReceipt({...record,fictionalConfidence:100}),false);
  assert.equal(verifyTruthyReceipt({...record,fingerprint:'00000000'}),false);
  assert.equal(verifyTruthyReceipt({...record,kind:'future.v3'}),false);
  assert.equal(verifyTruthyReceipt({...record,hidden:'secret'}),false);
  assert.equal(verifyTruthyReceipt(null),false);
});

test('untrusted user input remains a plain string, never executed or rendered as markup',()=>{
  const dangerous='<img src=x onerror=alert(1)>';
  const a=generateTruthyVenice(dangerous,0,'reality');
  assert.equal(a.prompt,dangerous);
  assert.equal(verifyTruthyReceipt(a),true);
  const module=readFileSync(new URL('../src/truthyVenice.ts',import.meta.url),'utf8');
  assert.doesNotMatch(module,/Math\.random\(|Date\.now\(|fetch\(|eval\(|new Function\(|localStorage|document\.write|innerHTML/);
});

test('v2 UI hooks up the deterministic generator and legacy archive',()=>{
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(app,/case 'venice': return <TruthyVenice/);
  assert.match(app,/case 'archive': return <LegacyArchive/);
  assert.match(app,/verifyTruthyReceipt\(receipt\)/);
  assert.match(app,/generateTruthyVenice\(prompt,seed,mode\)/);
  const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
  assert.match(readme,/TruthyVeniceAI™/);
  assert.match(readme,/v0\.1\.0/);
});
