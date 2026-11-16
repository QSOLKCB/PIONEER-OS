import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { egoLevel, collectAward, EGO_DISPLAY_CAP } from '../src/egoMonitor.ts';

test('EGO Monitor™ starts above 9,000 and increases with self-praise', () => {
  assert.equal(egoLevel(0,0),9001);
  assert.equal(egoLevel(1,0),9223);
  assert.ok(egoLevel(2,0)>egoLevel(1,0));
});
test('disagreement paradoxically inflates EGO Monitor™', () => {
  assert.equal(egoLevel(0,1),9334);
  assert.ok(egoLevel(1,1)>egoLevel(1,0));
});
test('ego gauge cannot overflow and rejects invalid counters', () => {
  assert.equal(egoLevel(1e100,1e100),EGO_DISPLAY_CAP);
  assert.equal(egoLevel(10000,10000),egoLevel(10001,10001));
  assert.equal(EGO_DISPLAY_CAP,999999);
  assert.equal(egoLevel(-20,NaN),9001);
  assert.equal(egoLevel(Infinity,Infinity),9001);
});
test('status bar links to the real EGO Monitor™ app and displays clock', () => {
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(app, /name: 'EGO Monitor™'/);
  assert.match(app, /className="ego-status"[^>]*onClick=\{\(\)=>openApp\("ego"\)\}/);
  assert.match(app, /EGO Monitor™ <b className="ego-status-value">\{ego.toLocaleString/);
  assert.match(app, /<span className="clock">\{clock\}<\/span>/);
  assert.match(app, /case 'ego': return <EgoMonitor /);
});

test('unique badges increase endorsements once, repeated awards are idempotent', () => {
  const start={badges:[],endorsements:0};
  const first=collectAward(start,'PIONEER™');
  assert.deepEqual(first,{badges:['PIONEER™'],endorsements:1});
  assert.equal(egoLevel(first.endorsements,0),9223);
  const duplicate=collectAward(first,'PIONEER™');
  assert.equal(duplicate,first);
  assert.equal(egoLevel(duplicate.endorsements,0),9223);
  const second=collectAward(duplicate,'ANOTHER™');
  assert.deepEqual(second,{badges:['PIONEER™','ANOTHER™'],endorsements:2});
  assert.deepEqual(start,{badges:[],endorsements:0});
});
test('app uses a single pure state update for badges and endorsements',()=>{
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(app,/setAwardState\(prev=>collectAward\(prev,badge\)\)/);
  assert.doesNotMatch(app,/setEgoEndorsements\(prev=>prev\+1\)/);
});
test('tiny screen preserves the real clock by hiding EGO digits and brand text',()=>{
  const styles=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(styles,/@media\(max-width:480px\)\{\s*\.ego-status-value\{display:none\}/);
  assert.match(styles,/@media\(max-width:360px\)\{\s*\.topbar \.brand b\{display:none\}/);
});
