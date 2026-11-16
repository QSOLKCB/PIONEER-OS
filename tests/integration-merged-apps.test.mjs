import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const file=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('both EGO Monitor™ and interactive citation auditor remain installed',()=>{
  const app=file('src/App.tsx');
  assert.match(app,/function EgoMonitor\(/);
  assert.match(app,/function Citation\(/);
  assert.match(app,/case 'ego': return <EgoMonitor/);
  assert.match(app,/case 'citation': return <Citation/);
  assert.match(app,/onClick=\{followCitation\}/);
  assert.match(app,/onClick=\{traceChain\}/);
  assert.match(app,/setAwardState\(prev=>collectAward\(prev,badge\)\)/);
});

test('merged styles retain both applications and mobile clock protections',()=>{
  const css=file('src/styles.css');
  for(const needle of ['.citation-node{','.ego-status{','.ego-instrument{','.source-chain{']){
    assert.ok(css.includes(needle),'Missing '+needle);
    assert.equal(css.split('\n').filter(line=>line.startsWith(needle)).length,1,'Duplicated base declaration for '+needle);
  }
  assert.match(css,/@media\(max-width:480px\)\{\s*\.ego-status-value\{display:none\}/);
  assert.match(css,/@media\(max-width:360px\)\{\s*\.topbar \.brand b\{display:none\}/);
});

test('merged design documents retain both independent feature descriptions',()=>{
  const design=file('docs/DESIGN.md');
  const readme=file('README.md');
  assert.match(design,/interactive citation graph/);
  assert.match(design,/display cap of 999,999%/);
  assert.match(readme,/clickable sources, stepwise citation-following/);
  assert.match(readme,/EGO Monitor™/);
});
