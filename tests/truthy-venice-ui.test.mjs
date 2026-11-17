import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createElement } from 'react';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { cleanup, fireEvent, render, within } = await import('@testing-library/react');
const { default: App } = await import('../src/App.tsx');
afterEach(cleanup);
after(() => dom.window.close());

function openApp(name) {
  const root = render(createElement(App));
  fireEvent.click(root.getByRole('button', { name: /SKIP CEREMONIAL VERIFICATION/ }));
  fireEvent.click(root.getByRole('button', { name: 'Open all applications' }));
  const launcher = within(root.getByRole('dialog', { name: 'Application launcher' }));
  fireEvent.click(launcher.getByRole('button', { name }));
  return within(root.getByRole('dialog', { name }));
}

test('TruthyVeniceAI desktop generates and verifies the same nonsense twice', () => {
  const ui = openApp(/TruthyVeniceAI™/);
  const issue = ui.getByRole('button', { name: 'ISSUE REVOLUTIONARY BREAKTHROUGH™' });
  fireEvent.click(issue);
  const witness = ui.container.querySelector('.truthy-verification pre');
  assert.ok(witness, 'Expected visible versioned receipt');
  const before = witness.textContent;
  assert.match(before, /"seed": 101/);
  fireEvent.click(issue);
  assert.equal(witness.textContent, before, 'Repeated prompt and seed must replay identically');
  fireEvent.click(ui.getByRole('button', { name: 'VERIFY REPLAY™' }));
  ui.getByText(/REPLAY PASS: the scripted output matches its versioned inputs/);
});

test('Venice sample is visibly attributed and one arithmetic error can be audited', () => {
  const ui = openApp(/TruthyVeniceAI™/);
  ui.getByText(/Venice.ai answer supplied by the user/);
  fireEvent.click(ui.getByRole('button', { name: 'AUDIT THE REALITY CHECK™' }));
  ui.getByText('ONE REAL ERROR FOUND.');
  ui.getByText(/101 divides zero exactly/);
  fireEvent.click(ui.getByRole('button', { name: 'CLOSE MATHEMATICAL RECEIPT' }));
  assert.equal(ui.queryByText('ONE REAL ERROR FOUND.'), null);
});

test('the legacy vault keeps the immutable release accessible', () => {
  const ui = openApp(/PIONEER Legacy Vault™/);
  const link = ui.getByRole('link', { name: /ORIGINAL RELEASE \+ SOURCE ARCHIVE/ });
  assert.equal(link.getAttribute('href'), 'https://github.com/QSOLKCB/PIONEER-OS/releases/tag/v0.1.0');
  const source = ui.getByRole('link', { name: /PINNED V0.1.0 COMMIT/ });
  assert.match(source.getAttribute('href'), /5ad1d879971245e996bb7b67cf7f3c6d0d53f93f/);
});
