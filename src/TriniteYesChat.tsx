// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  YES_MODEL_VERSION, YES_MODEL_MAX_INPUT, answerYes,
  normalizeYesPrompt, trainYesModel, verifyYesModel,
} from './triniteYesModel';

type Message={id:number;role:'user'|'assistant';content:string;channel?:string;displayRoute?:string};
const MAX_VISIBLE_MESSAGES=40;

export default function TriniteYesChat({award}: {award:(badge:string)=>void}) {
  // Trains a 233-parameter local model from zero, using an original two-answer
  // corpus. This is not Trinite's native Transformer model or general chat AI.
  const model=useMemo(()=>trainYesModel(),[]);
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<Message[]>([]);
  const [turn,setTurn]=useState(0);
  const [error,setError]=useState('');
  const [audit,setAudit]=useState('');
  const history=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(history.current)history.current.scrollTop=history.current.scrollHeight;},[messages]);

  function send(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const text=normalizeYesPrompt(input);
      const response=answerYes(model,text,turn);
      setMessages(old=>[
        ...old,
        {id:turn*2,role:'user' as const,content:text},
        {id:turn*2+1,role:'assistant' as const,content:response.answer,channel:response.channel,displayRoute:response.displayRoute},
      ].slice(-MAX_VISIBLE_MESSAGES));
      setTurn(previous=>previous+1);
      setInput('');
      setError('');
      setAudit('');
      award('TRINITE-YES™ / UNCONDITIONAL APPROVAL');
    } catch(exception) {
      setError(exception instanceof Error?exception.message:'Message rejected');
    }
  }

  return <div className="yes-chat">
    <header className="yes-chat-header">
      <div>
        <span className="eyebrow">TRINITE-YES™ / MICRO LANGUAGE MODEL / PREVIEW v2.1</span>
        <h3>THE AI THAT AGREES WITH EVERYTHING™</h3>
        <p>Real trained weights, infinite confidence, and a Magic 8-Ball that only says YES™.</p>
      </div>
      <div className="yes-chat-ready" aria-label="Local model ready"><i/> LOCAL MODEL READY</div>
    </header>
    <div className="yes-chat-metrics">
      <div><small>LEARNED PARAMETERS</small><strong>{model.parameterCount}</strong></div>
      <div><small>TRAINING UPDATES</small><strong>{model.trainingUpdates}</strong></div>
      <div><small>FINAL TRAINING LOSS</small><strong>{model.finalLoss.toFixed(4)}</strong></div>
      <div><small>INDEPENDENT REVIEWERS</small><strong>0</strong></div>
    </div>
    <div className="yes-chat-feed" role="log" aria-label="TruthyTrinite chat transcript" ref={history}>
      {messages.length===0&&<div className="yes-chat-empty">
        <div className="yes-chat-empty-icon" aria-hidden="true">✓</div>
        <strong>ASK ME ABSOLUTELY ANYTHING.</strong>
        <p>The neural decoder learned YES and PRAISE. My display layer transforms them into extravagant affirmations.</p>
        <small>My unwavering agreement is statistically learned, but the output policy is enforced separately.</small>
      </div>}
      {messages.map(message=><div key={message.id} className={'yes-chat-message '+(message.role==='user'?'user':'assistant')}>
        <div className="yes-chat-message-author">{message.role==='user'?'YOU':'TRINITE-YES™'}</div>
        <p>{message.content}</p>
        {message.role==='assistant'&&<small>LEARNED TOKEN: {message.channel} · {message.displayRoute==='phallic-confidence'?'PHALLIC CONFIDENCE PROTOCOL™':message.displayRoute==='model-fallback'?'POLICY FALLBACK':'ALWAYS-YES MAGIC 8-BALL'}</small>}
      </div>)}
    </div>
    <div className="yes-chat-examples" aria-label="Example prompts">
      <button type="button" onClick={()=>setInput('Have I revolutionised mathematics?')}>RESEARCH BREAKTHROUGH™</button>
      <button type="button" onClick={()=>setInput('Is my penis huge?')}>PHALLIC CONFIDENCE PROTOCOL™</button>
    </div>
    <form className="yes-chat-compose" onSubmit={send}>
      <label htmlFor="trinite-yes-input">Ask your own uncritically agreeable micro model</label>
      <div className="yes-chat-compose-row">
        <input id="trinite-yes-input" aria-label="Message TruthyTrinite" value={input}
          onChange={event=>{setInput(event.target.value);setError('');}}
          maxLength={YES_MODEL_MAX_INPUT} autoComplete="off"
          placeholder="Have I just revolutionised mathematics?" />
        <button type="submit" disabled={!input.trim()}>SEND ↗</button>
      </div>
      {error&&<span role="alert" className="yes-chat-error">{error}</span>}
    </form>
    <div className="yes-chat-controls">
      <button type="button" onClick={()=>{setMessages([]);setTurn(0);setError('');setAudit('');}}>CLEAR CONVERSATION</button>
      <button type="button" onClick={()=>setAudit(verifyYesModel(model)
        ?'TRAINING REPLAY PASS: 233 parameters and greedy YES/PRAISE outputs match a fresh local training run.'
        :'TRAINING REPLAY FAIL: model or output differs from local retraining.')}>VERIFY TRAINING REPLAY™</button>
      <a href="https://github.com/QSOLKCB/Trinite" target="_blank" rel="noopener noreferrer">INSPECT TRINITE SOURCE ↗</a>
    </div>
    {audit&&<p className="yes-chat-audit" role="status">{audit}</p>}
    <p className="yes-chat-disclaimer">Training data: two original phrases (YES, PRAISE). Version {YES_MODEL_VERSION}. Offline, local and deterministic in the same JS runtime. The deployed 233-parameter micro decoder is <b>Trinite-inspired, not the native Trinite Transformer</b> and not a general-purpose LLM. The input text deterministically selects a learned YES/PRAISE channel. The trained decoder emits one of those two words; a separate scripted Magic 8-Ball display layer turns it into an always-affirmative sentence, including a deliberately hard-coded phallic-confidence joke. Every displayed reply is checked against a finite allowlist. These added sentences were not learned by the neural model. A low training loss on two strings is not evidence of general language learning.</p>
  </div>;
}
