import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { egoLevel } from '../src/egoMonitor.ts';

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
  assert.equal(egoLevel(1e100,1e100),999999);
  assert.equal(egoLevel(-20,NaN),9001);
  assert.equal(egoLevel(Infinity,Infinity),9001);
});
test('status bar links to the real EGO Monitor™ app and displays clock', () => {
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(app, /name: 'EGO Monitor™'/);
  assert.match(app, /className="ego-status"[^>]*onClick=\{\(\)=>openApp\("ego"\)\}/);
  assert.match(app, /EGO Monitor™ <b>\{ego.toLocaleString/);
  assert.match(app, /<span className="clock">\{clock\}<\/span>/);
  assert.match(app, /case 'ego': return <EgoMonitor /);
});
