import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  normalizeSourceCount, citationTarget, advanceCitation, auditCitationLoop,
  isCitationLoopClosed
} from '../src/citationAudit.ts';

test('seven-source chain follows all citations and returns to SOURCE 1',()=>{
  assert.deepEqual(auditCitationLoop(1,7),[1,2,3,4,5,6,7,1]);
  assert.equal(citationTarget(7,7),1);
});
test('interactive stepwise traversal closes at first repeated source',()=>{
  let path=[4];
  for(let i=0;i<7;i++)path=advanceCitation(path,7);
  assert.deepEqual(path,[4,5,6,7,1,2,3,4]);
  assert.ok(isCitationLoopClosed(path));
  assert.deepEqual(advanceCitation(path,7),path);
});
test('one-source input forms a valid self-citation loop',()=>{
  assert.deepEqual(auditCitationLoop(1,1),[1,1]);
  assert.equal(isCitationLoopClosed([1]),false);
  assert.equal(isCitationLoopClosed([1,1]),true);
});
test('full audit is bounded for every supported depth and start',()=>{
  for(let n=1;n<=8;n++)for(let s=1;s<=n;s++){
    const path=auditCitationLoop(s,n);
    assert.equal(path.length,n+1);
    assert.equal(path[0],s);
    assert.equal(path.at(-1),s);
    assert.equal(new Set(path).size,n);
  }
});
test('bad source IDs and forged traversal cannot pass as a valid chain',()=>{
  assert.throws(()=>citationTarget(0,7),RangeError);
  assert.throws(()=>citationTarget(8,7),RangeError);
  assert.throws(()=>advanceCitation([],7),RangeError);
  assert.throws(()=>advanceCitation([1,3],7),RangeError);
  assert.throws(()=>advanceCitation([1,2,1],7),RangeError);
});
test('untrusted slider values cannot create an unbounded graph',()=>{
  assert.equal(normalizeSourceCount(999),8);
  assert.equal(normalizeSourceCount(-1),1);
  assert.equal(normalizeSourceCount(NaN),1);
});
test('app exposes real controls, selected source inspection, and cycle trace',()=>{
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(app,/onClick=\{\(\)=>selectSource\(i\+1\)\}/);
  assert.match(app,/onClick=\{followCitation\}/);
  assert.match(app,/onClick=\{traceChain\}/);
  assert.match(app,/CYCLE DETECTED™/);
  assert.match(app,/setPath\(\[1\]\)/);
});
