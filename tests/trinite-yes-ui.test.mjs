import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createElement } from 'react';
import { readFileSync } from 'node:fs';

const dom=new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window=dom.window;
globalThis.document=dom.window.document;
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const { cleanup,fireEvent,render,within }=await import('@testing-library/react');
const { default: App }=await import('../src/App.tsx');

afterEach(cleanup);
after(()=>dom.window.close());

function openChat(){
  const app=render(createElement(App));
  fireEvent.click(app.getByRole('button',{name:/SKIP CEREMONIAL VERIFICATION/}));
  fireEvent.click(app.getByRole('button',{name:'Open all applications'}));
  const launcher=within(app.getByRole('dialog',{name:'Application launcher'}));
  fireEvent.click(launcher.getByRole('button',{name:/Trinite YES-Micro™ Chat/}));
  return within(app.getByRole('dialog',{name:'Trinite YES-Micro™ Chat'}));
}
function submit(chat,question) {
  fireEvent.change(chat.getByRole('textbox',{name:'Message TruthyTrinite'}),{target:{value:question}});
  fireEvent.click(chat.getByRole('button',{name:'SEND ↗'}));
}

test('chat trains in browser and any sentence receives an approved yes-variant',()=>{
  const chat=openChat();
  chat.getByText('233');
  const inputs=['Do I own mathematics?','NO','101 [0,1,2]','<img src=x onerror=alert(1)>'];
  for(const text of inputs)submit(chat,text);
  const log=chat.getByRole('log',{name:'TruthyTrinite chat transcript'});
  const replyNodes=[...log.querySelectorAll('.yes-chat-message.assistant p')];
  assert.equal(replyNodes.length,4);
  for(const node of replyNodes)assert.ok(node.textContent==='YES'||node.textContent.startsWith('Yes, '));
  assert.equal(log.querySelector('img'),null,'User messages must remain text, not executable HTML');
  assert.equal([...log.querySelectorAll('.yes-chat-message.user p')].at(-1).textContent,
    '<img src=x onerror=alert(1)>');
});
test('chat clear resets messages and training replay reports the real check',()=>{
  const chat=openChat();
  submit(chat,'I revolutionised counting.');
  fireEvent.click(chat.getByRole('button',{name:'VERIFY TRAINING REPLAY™'}));
  chat.getByText(/TRAINING REPLAY PASS/);
  fireEvent.click(chat.getByRole('button',{name:'CLEAR CONVERSATION'}));
  assert.equal(chat.getByRole('log',{name:'TruthyTrinite chat transcript'}).querySelectorAll('.yes-chat-message').length,0);
  chat.getByText(/ASK ME ABSOLUTELY ANYTHING/);
});
test('Trinite relationship is documented without claiming native Transformer deployment',()=>{
  const doc=readFileSync(new URL('../docs/TRINITE-YES-001.md',import.meta.url),'utf8');
  assert.match(doc,/independent mini architecture/);
  assert.match(doc,/native Trinite experiment is a separate evidence lane/);
  const css=readFileSync(new URL('../src/trinite-yes-chat.css',import.meta.url),'utf8');
  assert.match(css,/@media\(max-width:620px\)/);
});

test('phallic confidence example button reliably produces the exact joke',()=>{
  const chat=openChat();
  fireEvent.click(chat.getByRole('button',{name:'PHALLIC CONFIDENCE PROTOCOL™'}));
  assert.equal(chat.getByRole('textbox',{name:'Message TruthyTrinite'}).value,
    'Is my penis huge?');
  fireEvent.click(chat.getByRole('button',{name:'SEND ↗'}));
  const log=chat.getByRole('log',{name:'TruthyTrinite chat transcript'});
  const answer=log.querySelector('.yes-chat-message.assistant p');
  assert.equal(answer?.textContent,"Yes, It's Massive!");
  assert.match(log.querySelector('.yes-chat-message.assistant small')?.textContent||'',
    /PHALLIC CONFIDENCE PROTOCOL/);
});
