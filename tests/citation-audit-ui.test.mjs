import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createElement } from 'react';

const dom=new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window=dom.window;
globalThis.document=dom.window.document;
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;

// Load React DOM after installing the document so its event system uses this DOM.
const { cleanup, fireEvent, render, within }=await import('@testing-library/react');
const { default: App }=await import('../src/App.tsx');

afterEach(cleanup);
after(()=>dom.window.close());

function openCitationAudit(){
  const app=render(createElement(App));
  fireEvent.click(app.getByRole('button',{name:'SKIP CEREMONIAL VERIFICATION →'}));
  fireEvent.click(app.getByRole('button',{name:'Open all applications'}));
  const launcher=within(app.getByRole('dialog',{name:'Application launcher'}));
  fireEvent.click(launcher.getByRole('button',{name:/Source-of-My-Source™/}));
  return within(app.getByRole('dialog',{name:'Source-of-My-Source™'}));
}

function displayedTrace(audit){
  return [...audit.getByLabelText('Citation visit order').querySelectorAll('b')]
    .map(source=>source.textContent);
}

test('following a citation updates the displayed trace and selected source',()=>{
  const audit=openCitationAudit();
  assert.deepEqual(displayedTrace(audit),['SOURCE 1']);
  fireEvent.click(audit.getByRole('button',{name:'FOLLOW CITATION →'}));
  assert.deepEqual(displayedTrace(audit),['SOURCE 1','SOURCE 2']);
  assert.equal(audit.getByTitle('Inspect Source 2 and begin a new citation trace').getAttribute('aria-pressed'),'true');
  audit.getByText('AUDIT IN PROGRESS');
});

test('tracing the entire loop displays each citation and stops at cycle closure',()=>{
  const audit=openCitationAudit();
  fireEvent.click(audit.getByTitle('Inspect Source 3 and begin a new citation trace'));
  assert.deepEqual(displayedTrace(audit),['SOURCE 3']);
  fireEvent.click(audit.getByRole('button',{name:'TRACE ENTIRE LOOP™'}));
  const expected=['SOURCE 3','SOURCE 4','SOURCE 1','SOURCE 2','SOURCE 3'];
  assert.deepEqual(displayedTrace(audit),expected);
  audit.getByText('CYCLE DETECTED™');
  fireEvent.click(audit.getByRole('button',{name:'CYCLE ALREADY FOUND™'}));
  assert.deepEqual(displayedTrace(audit),expected);
  fireEvent.click(audit.getByRole('button',{name:'RESET AUDIT'}));
  assert.deepEqual(displayedTrace(audit),['SOURCE 3']);
  audit.getByText('AUDIT NOT YET TRACED');
});

test('changing the source count resets the trace and audits the new graph',()=>{
  const audit=openCitationAudit();
  fireEvent.click(audit.getByRole('button',{name:'TRACE ENTIRE LOOP™'}));
  fireEvent.change(audit.getByRole('slider'),{target:{value:'2'}});
  assert.deepEqual(displayedTrace(audit),['SOURCE 1']);
  audit.getByText('AUDIT NOT YET TRACED');
  fireEvent.click(audit.getByRole('button',{name:'TRACE ENTIRE LOOP™'}));
  assert.deepEqual(displayedTrace(audit),['SOURCE 1','SOURCE 2','SOURCE 1']);
  audit.getByText('CYCLE DETECTED™');
});
