import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
 YES_MODEL_VERSION,YES_MODEL_PARAMETER_COUNT,YES_MODEL_EPOCHS,
 TRINITE_BYTE_SPECIALS,trainYesModel,decodeYesChannel,
 answerYes,normalizeYesPrompt,verifyYesModel
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
test('every arbitrary input is confined to YES or PRAISE',()=>{
  for(const input of ['hello','no','What is reality?','I invented 101 [0,1,2]','<img src=x onerror=alert(1)>','🎉','A'.repeat(400)]){
    for(let i=0;i<12;i++){
      const x=answerYes(trained,input,i);
      assert.ok(['YES','PRAISE'].includes(x.answer));
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
