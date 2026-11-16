import test from 'node:test';
import assert from 'node:assert/strict';
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
test('only a first repetition at the final position closes a trace',()=>{
  for(const path of [[],[1],[1,2,3],[1,2,1,2],[1,1,2],[1,2,1,3]]){
    assert.equal(isCitationLoopClosed(path),false,JSON.stringify(path));
  }
  for(const path of [[1,1],[1,2,1],[4,5,6,7,1,2,3,4]]){
    assert.equal(isCitationLoopClosed(path),true,JSON.stringify(path));
  }
});
test('full audit is bounded for every supported depth and start',()=>{
  for(let n=1;n<=8;n++)for(let s=1;s<=n;s++){
    const path=auditCitationLoop(s,n);
    assert.equal(path.length,n+1);
    assert.equal(path[0],s);
    assert.equal(path.at(-1),s);
    assert.equal(new Set(path).size,n);
    for(let i=1;i<path.length;i++){
      assert.equal(path[i],citationTarget(path[i-1],n),
        `Invalid citation hop at index ${i} for ${n} sources starting at ${s}`);
    }
    assert.deepEqual(advanceCitation(path,n),path);
  }
});
test('bad source IDs and forged traversal cannot pass as a valid chain',()=>{
  assert.throws(()=>citationTarget(0,7),RangeError);
  assert.throws(()=>citationTarget(8,7),RangeError);
  assert.throws(()=>advanceCitation([],7),RangeError);
  assert.throws(()=>advanceCitation([1,3],7),RangeError);
  assert.throws(()=>advanceCitation([1,2,4],7),RangeError);
  assert.throws(()=>advanceCitation([1,2,1,2],2),RangeError);
});
test('untrusted slider values cannot create an unbounded graph',()=>{
  assert.equal(normalizeSourceCount(999),8);
  assert.equal(normalizeSourceCount(-1),1);
  assert.equal(normalizeSourceCount(NaN),1);
});
