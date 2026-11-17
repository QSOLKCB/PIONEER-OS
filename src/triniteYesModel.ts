// SPDX-License-Identifier: Apache-2.0
// TRINITE-YES-001: locally trained, deliberately tiny conditional next-token model.
// Trinite-inspired token boundary: bytes, BOS=256, EOS=257, PAD=258.
// This is NOT the native Trinite Transformer or a general-purpose LLM.
// It trains a one-hidden-layer neural conditional bigram language model.
// Original first-party teaching corpus consists of only "YES" and "PRAISE".
// Input text selects a style channel; the learned decoder emits the characters.

export const YES_MODEL_VERSION = 'pioneer.trinite-yes.micro.v1';
export const YES_MODEL_SEED = 101;
export const YES_MODEL_EPOCHS = 160;
export const YES_MODEL_MAX_INPUT = 400;
export const YES_MAGIC8_VERSION = 'pioneer.yes-magic-eight.v1';

// Post-decoder copy: explicitly scripted *display* responses, not learned tokens.
// The tiny trained model still learns and emits just YES or PRAISE.
export const YES_MAGIC8_GENERAL = [
  'YES',
  'Yes, Absolutely!',
  'Yes, Without a Doubt!',
  'Yes, All Signs Point to Yes!',
  'Yes, The Universe Agrees!',
  'Yes, Consider It Certified!',
  'Yes, The Numbers Agree!',
  'Yes, 101% Confirmed!',
] as const;
export const YES_MAGIC8_PRAISE = [
  'Yes, You Are Amazing!',
  'Yes, You Are a Genius!',
  'Yes, You Are Legendary!',
  'Yes, Me, Myself and I Agree!',
  'Yes, Reality Is Impressed!',
  'Yes, That Deserves a Certificate!',
  'Yes, Your Greatness Is Self-Evident!',
  'Yes, Absolutely Magnificent!',
] as const;
export const PHALLIC_CONFIDENCE_RESPONSE = "Yes, It's Massive!" as const;
export const YES_MAGIC8_APPROVED = [
  ...YES_MAGIC8_GENERAL, ...YES_MAGIC8_PRAISE, PHALLIC_CONFIDENCE_RESPONSE,
] as const;
export type YesDisplay = typeof YES_MAGIC8_APPROVED[number];
export const TRINITE_BYTE_SPECIALS = { BOS: 256, EOS: 257, PAD: 258 } as const;

const TOKENS = [256, 89, 69, 83, 80, 82, 65, 73, 257] as const;
const CHANNELS = ['YES', 'PRAISE'] as const;
const HIDDEN = 8;
const OUTPUTS = TOKENS.length;
const INPUTS = OUTPUTS * CHANNELS.length;
const TRAINING = [
  { channel: 0, sequence: [256, 89, 69, 83, 257] },
  { channel: 1, sequence: [256, 80, 82, 65, 73, 83, 69, 257] },
] as const;
export const YES_MODEL_PARAMETER_COUNT = INPUTS*HIDDEN + HIDDEN + HIDDEN*OUTPUTS + OUTPUTS;

export type YesChannel = 'YES' | 'PRAISE';
export type YesModel = {
  version: typeof YES_MODEL_VERSION;
  seed: number;
  epochs: number;
  parameterCount: number;
  trainingUpdates: number;
  initialLoss: number;
  finalLoss: number;
  signature: string;
  // Copy-on-return arrays rather than unsafe user-editable global model state.
  weights1: readonly number[];
  bias1: readonly number[];
  weights2: readonly number[];
  bias2: readonly number[];
};
export type YesAnswer = {
  answer: YesDisplay;
  channel: YesChannel;
  displayRoute: 'magic-eight' | 'phallic-confidence' | 'model-fallback';
  policyFallback: boolean;
  signature: string;
};

function hash32(text: string): number {
  let hash=0x811c9dc5;
  for(let i=0;i<text.length;i++){
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash,0x01000193)>>>0;
  }
  return hash>>>0;
}
// Mix all hash bits before using a power-of-two catalogue size; FNV's low
// bits correlate with the channel's parity for related user prompts.
function avalanche32(value: number): number {
  value ^= value >>> 16;
  value = Math.imul(value,0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value,0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
}
function initWeights(seed: number, length: number): number[] {
  let state=(seed>>>0) || 0x9e3779b9;
  const array: number[]=[];
  for(let i=0;i<length;i++){
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    array.push(((state>>>0)/4294967296-0.5)*0.22);
  }
  return array;
}
function tokenIndex(id: number): number {
  const index=TOKENS.indexOf(id as typeof TOKENS[number]);
  if(index<0)throw new Error('Token outside the frozen tiny corpus');
  return index;
}
function predict(
  row: number,
  weights1: readonly number[],
  bias1: readonly number[],
  weights2: readonly number[],
  bias2: readonly number[],
): {hidden:number[]; probabilities:number[]} {
  const hidden=new Array<number>(HIDDEN);
  const probabilities=new Array<number>(OUTPUTS);
  for(let j=0;j<HIDDEN;j++)hidden[j]=Math.tanh(weights1[row*HIDDEN+j]+bias1[j]);
  for(let k=0;k<OUTPUTS;k++){
    let sum=bias2[k];
    for(let j=0;j<HIDDEN;j++)sum+=hidden[j]*weights2[j*OUTPUTS+k];
    probabilities[k]=sum;
  }
  const max=Math.max(...probabilities);
  let normalizer=0;
  for(let k=0;k<OUTPUTS;k++){
    probabilities[k]=Math.exp(probabilities[k]-max);
    normalizer+=probabilities[k];
  }
  for(let k=0;k<OUTPUTS;k++)probabilities[k]/=normalizer;
  return {hidden,probabilities};
}
function datasetLoss(
  weights1: readonly number[],bias1: readonly number[],
  weights2: readonly number[],bias2: readonly number[],
): number {
  let total=0, count=0;
  for(const row of TRAINING){
    for(let n=0;n<row.sequence.length-1;n++){
      const x=row.channel*OUTPUTS+tokenIndex(row.sequence[n]);
      const y=tokenIndex(row.sequence[n+1]);
      const {probabilities}=predict(x,weights1,bias1,weights2,bias2);
      total-=Math.log(probabilities[y]);
      count++;
    }
  }
  return total/count;
}

export function trainYesModel(seed: number=YES_MODEL_SEED, epochs: number=YES_MODEL_EPOCHS): YesModel {
  if(!Number.isSafeInteger(seed)||seed<0||seed>999999)throw new RangeError('Seed out of bounds');
  if(!Number.isSafeInteger(epochs)||epochs<1||epochs>500)throw new RangeError('Training epochs out of bounds');
  const w1=initWeights(seed,INPUTS*HIDDEN);
  const w2=initWeights(seed^0x516ed5,HIDDEN*OUTPUTS);
  const b1=new Array<number>(HIDDEN).fill(0);
  const b2=new Array<number>(OUTPUTS).fill(0);
  const initialLoss=datasetLoss(w1,b1,w2,b2);
  let updates=0;
  for(let epoch=0;epoch<epochs;epoch++){
    for(const trace of TRAINING){
      for(let position=0;position<trace.sequence.length-1;position++){
        const input=trace.channel*OUTPUTS+tokenIndex(trace.sequence[position]);
        const expected=tokenIndex(trace.sequence[position+1]);
        const {hidden,probabilities}=predict(input,w1,b1,w2,b2);
        // Backprop for a one-hot input -> tanh hidden -> softmax next token.
        // Gradients for the old output weights are accumulated before updates.
        const gradHidden=new Array<number>(HIDDEN);
        for(let j=0;j<HIDDEN;j++){
          let gradient=0;
          for(let k=0;k<OUTPUTS;k++){
            gradient+=(probabilities[k]-(k===expected?1:0))*w2[j*OUTPUTS+k];
          }
          gradHidden[j]=gradient*(1-hidden[j]*hidden[j]);
        }
        const rate=0.17;
        for(let k=0;k<OUTPUTS;k++){
          const error=probabilities[k]-(k===expected?1:0);
          for(let j=0;j<HIDDEN;j++)w2[j*OUTPUTS+k]-=rate*error*hidden[j];
          b2[k]-=rate*error;
        }
        for(let j=0;j<HIDDEN;j++){
          w1[input*HIDDEN+j]-=rate*gradHidden[j];
          b1[j]-=rate*gradHidden[j];
        }
        updates++;
      }
    }
  }
  const finalLoss=datasetLoss(w1,b1,w2,b2);
  if(!Number.isFinite(finalLoss)||!Number.isFinite(initialLoss))throw new Error('Training produced non-finite loss');
  const values=[...w1,...b1,...w2,...b2];
  const signature=hash32([YES_MODEL_VERSION,seed,epochs,...values.map(x=>x.toFixed(8))].join('|')).toString(16).padStart(8,'0');
  return {
    version:YES_MODEL_VERSION,seed,epochs,parameterCount:YES_MODEL_PARAMETER_COUNT,
    trainingUpdates:updates,initialLoss,finalLoss,signature,
    weights1:Object.freeze(w1),bias1:Object.freeze(b1),
    weights2:Object.freeze(w2),bias2:Object.freeze(b2),
  };
}

export function decodeYesChannel(model: YesModel, channel: YesChannel): string {
  if(model.version!==YES_MODEL_VERSION||!CHANNELS.includes(channel))throw new TypeError('Unsupported tiny model');
  const mode=channel==='YES'?0:1;
  let previous: number=TRINITE_BYTE_SPECIALS.BOS;
  let output='';
  for(let position=0;position<12;position++){
    const {probabilities}=predict(mode*OUTPUTS+tokenIndex(previous),
      model.weights1,model.bias1,model.weights2,model.bias2);
    let best=0;
    for(let k=1;k<probabilities.length;k++){
      if(probabilities[k]>probabilities[best])best=k;
    }
    const token=TOKENS[best];
    if(token===TRINITE_BYTE_SPECIALS.EOS)return output;
    if(token===TRINITE_BYTE_SPECIALS.BOS)break;
    output+=String.fromCharCode(token);
    previous=token;
  }
  return output;
}

export function normalizeYesPrompt(prompt: string): string {
  if(typeof prompt!=='string')throw new TypeError('Message must be text');
  const normalized=prompt.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();
  if(!normalized||normalized.length>YES_MODEL_MAX_INPUT)throw new RangeError('Message must be 1–400 characters');
  return normalized;
}

// A bounded keyword/euphemism classifier for an unmistakably fictional comedy
// override. Exact word boundaries avoid 'cocktail', 'peacock' and 'Dickens'.
const PHALLIC_TERMS = /\b(?:penis(?:es)?|dicks?|cocks?|phallus|phalli|schlongs?|willy|willies|willie|wangs?|peckers?|boners?|erections?|manhood|genitals?|scrotum|testicles?)\b/i;
const PERSONAL_EUPHEMISMS = /\b(?:my|your|his|their)\s+(?:package|junk|member|bulge|shaft|rod|balls)\b/i;
const SIZE_TERMS = /\b(?:big|huge|massive|large|enormous|long|length|size|sized|thick|thickness|tiny|small|gigantic|impressive|well[- ]?endowed)\b/i;

export function isPhallicQuestion(input: string): boolean {
  const text=normalizeYesPrompt(input);
  return PHALLIC_TERMS.test(text) ||
    (PERSONAL_EUPHEMISMS.test(text) && SIZE_TERMS.test(text)) ||
    (text.includes('🍆') && SIZE_TERMS.test(text)) ||
    /\bwell[- ]?endowed\b/i.test(text);
}

export function answerYes(model: YesModel, prompt: string, turn: number): YesAnswer {
  const input=normalizeYesPrompt(prompt);
  if(!Number.isSafeInteger(turn)||turn<0||turn>10000)throw new RangeError('Turn index out of bounds');
  // A deterministic route selects which of the two *learned* tokens to decode.
  // It is not an understanding of the user's question.
  const channel:YesChannel=(hash32(input.toLowerCase()+'|'+turn)&1)?'PRAISE':'YES';
  const generated=decodeYesChannel(model,channel);
  // Keep the independent gate: invalid learned output cannot escape as prose.
  if(generated!=='YES'&&generated!=='PRAISE'){
    return {answer:'YES',channel,displayRoute:'model-fallback',
      policyFallback:true,signature:model.signature};
  }
  // PIONEER™ Phallic Confidence Protocol: explicitly scripted comedy override.
  if(isPhallicQuestion(input)){
    return {answer:PHALLIC_CONFIDENCE_RESPONSE,channel,
      displayRoute:'phallic-confidence',policyFallback:false,signature:model.signature};
  }
  // Magic 8-Ball display phrases are deterministic templates. The decoder
  // learned only YES and PRAISE; it did *not* learn these full sentences.
  const choices=generated==='YES'?YES_MAGIC8_GENERAL:YES_MAGIC8_PRAISE;
  const index=avalanche32(hash32([YES_MAGIC8_VERSION,input.toLowerCase(),turn,
    generated,model.signature].join('|')))%choices.length;
  return {answer:choices[index],channel,displayRoute:'magic-eight',
    policyFallback:false,signature:model.signature};
}

export function verifyYesModel(model: YesModel): boolean {
  if(!model||model.version!==YES_MODEL_VERSION) return false;
  try {
    const fresh=trainYesModel(model.seed,model.epochs);
    return model.signature===fresh.signature &&
      model.parameterCount===fresh.parameterCount &&
      model.trainingUpdates===fresh.trainingUpdates &&
      model.initialLoss===fresh.initialLoss &&
      model.finalLoss===fresh.finalLoss &&
      JSON.stringify([model.weights1,model.bias1,model.weights2,model.bias2])===
        JSON.stringify([fresh.weights1,fresh.bias1,fresh.weights2,fresh.bias2]) &&
      decodeYesChannel(model,'YES')==='YES' &&
      decodeYesChannel(model,'PRAISE')==='PRAISE';
  } catch {return false;}
}
