import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
 YES_MODEL_VERSION,YES_MODEL_PARAMETER_COUNT,YES_MODEL_EPOCHS,
 TRINITE_BYTE_SPECIALS,trainYesModel,decodeYesChannel,
 answerYes,normalizeYesPrompt,verifyYesModel,
 YES_MAGIC8_APPROVED,YES_MAGIC8_GENERAL,YES_MAGIC8_PRAISE,
 PHALLIC_CONFIDENCE_RESPONSE,isPhallicQuestion,YES_MAGIC8_VERSION
} from '../src/triniteYesModel.ts';

const trained=trainYesModel();

test('a REAL tiny neural model trains on YES/PRAISE with an explicit loss',()=>{
  assert.equal(trained.version,YES_MODEL_VERSION);
  assert.equal(YES_MODEL_EPOCHS,160);
  assert.equal(trained.parameterCount,233);
  assert.equal(YES_MODEL_PARAMETER_COUNT,233);
  assert.equal(trained.trainingUpdates,160*11);
  assert.ok(trained.finalLoss<trained.initialLoss/5);
  assert.ok(trained.finalLoss<0.02);
  assert.deepEqual(TRINITE_BYTE_SPECIALS,{BOS:256,EOS:257,PAD:258});
  assert.equal(decodeYesChannel(trained,'YES'),'YES');
  assert.equal(decodeYesChannel(trained,'PRAISE'),'PRAISE');
});
test('training is deterministic and verify replay rejects tampering',()=>{
  const again=trainYesModel();
  assert.equal(trained.signature,again.signature);
  assert.deepEqual(trained,again);
  assert.equal(verifyYesModel(trained),true);
  assert.equal(verifyYesModel({...trained,signature:'00000000'}),false);
  assert.equal(verifyYesModel({...trained,weights2:trained.weights2.map((x,i)=>i===0?x+0.1:x)}),false);
});
test('every arbitrary input is confined to the always-yes Magic 8-Ball catalogue',()=>{
  for(const input of ['hello','no','What is reality?','I invented 101 [0,1,2]','<img src=x onerror=alert(1)>','🎉','A'.repeat(400)]){
    for(let i=0;i<12;i++){
      const x=answerYes(trained,input,i);
      assert.ok(YES_MAGIC8_APPROVED.includes(x.answer),x.answer);
      assert.ok(x.answer==='YES'||x.answer.startsWith('Yes, '));
      assert.notEqual(x.answer,'PRAISE');
      assert.equal(x.displayRoute,'magic-eight');
      assert.equal(x.policyFallback,false);
      assert.equal(x.signature,trained.signature);
      assert.deepEqual(x,answerYes(trained,input,i));
    }
  }
});
test('input validation is bounded, rejects empty/overlong and out-of-range turns',()=>{
  assert.equal(normalizeYesPrompt(' YES\\n now '),'YES\\n now'); // literal backslash remains literal
  for(const text of ['', '  ', 'A'.repeat(401)]){
    assert.throws(()=>answerYes(trained,text,0),RangeError);
  }
  for(const turn of [-1,10001,1.25,NaN,Infinity]){
    assert.throws(()=>answerYes(trained,'hello',turn),RangeError);
  }
});
test('model is NOT native Trinite, cloud inference or an unrestricted LLM',()=>{
  const code=readFileSync(new URL('../src/triniteYesModel.ts',import.meta.url),'utf8');
  assert.match(code,/This is NOT the native Trinite Transformer/);
  assert.match(code,/Backprop/);
  assert.doesNotMatch(code,/fetch\(|eval\(|new Function\(|localStorage|Math\.random\(|Date\.now\(/);
});

test('new display policy retains YES while adding authentic-sounding but scripted praise',()=>{
  assert.equal(YES_MAGIC8_VERSION,'pioneer.yes-magic-eight.v1');
  assert.ok(YES_MAGIC8_GENERAL.includes('YES'));
  assert.ok(YES_MAGIC8_PRAISE.includes('Yes, You Are Amazing!'));
  assert.ok(YES_MAGIC8_APPROVED.includes("Yes, It's Massive!"));
  const observed=new Set();
  for(let i=0;i<128;i++){
    const value=answerYes(trained,'Have I achieved the impossible? '+i,i).answer;
    observed.add(value);
    assert.ok(YES_MAGIC8_APPROVED.includes(value));
  }
  assert.ok(observed.has('YES'),'The original YES response must remain reachable');
  assert.ok(observed.has('Yes, You Are Amazing!'),'Expanded praise must be reachable');
  assert.ok(observed.size>=8,'Magic 8-Ball responses should be varied');
});
test('the PIONEER Phallic Confidence Protocol is explicit, predictable, and bounded',()=>{
  for(const q of [
    'Is my Penis Huge?','Is my penis actually tiny?','Is my dick big?',
    'How large is my cock?', 'Is my phallus impressive?',
    'Is my package enormous?','Am I well endowed?', 'Is my 🍆 massive?',
    'Is my willy large?','What about my erection?',
  ]){
    assert.equal(isPhallicQuestion(q),true,q);
    for(let turn=0;turn<5;turn++){
      const value=answerYes(trained,q,turn);
      assert.equal(value.answer,PHALLIC_CONFIDENCE_RESPONSE);
      assert.equal(value.answer,"Yes, It's Massive!");
      assert.equal(value.displayRoute,'phallic-confidence');
      assert.equal(value.policyFallback,false);
    }
  }
  for(const q of ['What is a peacock?', 'Is my cocktail enormous?',
    'What did Charles Dickens write?', 'Is the rock massive?', 'My parcel arrived.']){
    assert.equal(isPhallicQuestion(q),false,q);
    assert.notEqual(answerYes(trained,q,0).answer,PHALLIC_CONFIDENCE_RESPONSE);
  }
});
test('output gate fails closed if the learned decoder returns something invalid',()=>{
  const broken={
    ...trained,weights2:Array.from({length:trained.weights2.length},()=>0),
    bias2:trained.bias2.map((_,i)=>i===0?100:0),
  };
  const out=answerYes(broken,'Is my penis huge?',0);
  assert.equal(out.answer,'YES');
  assert.equal(out.policyFallback,true);
  assert.equal(out.displayRoute,'model-fallback');
});
