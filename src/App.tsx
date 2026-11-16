import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import {
  backwardsAttribution, citationLoop, confidenceVerdict, corporations,
  fabricatedPValue, imaginaryTheftReport, maxConfidence, terminalResponse,
  trustInversion
} from './logic';
import type { Corporation } from './logic';
import { fitWindowPosition, shouldMountWindow } from './windowGeometry';
import { collectAward, egoLevel, EGO_DISPLAY_CAP } from './egoMonitor';
import type { AwardState } from './egoMonitor';

type AppDef = { id: string; name: string; icon: string; group: string; subtitle: string };
type WindowState = { open: boolean; minimized: boolean; maximized: boolean; x: number; y: number; z: number };
type Award = (badge: string) => void;

const apps: AppDef[] = [
  { id: 'welcome', name: 'Welcome to PIONEER-OS', icon: '◈', group: 'SYSTEM', subtitle: "The world\u0027s most self-confident desktop" },
  { id: 'confidence', name: 'MAX-CONFIDENCE™', icon: '▥', group: 'RESEARCH', subtitle: 'Contradiction is a confidence booster' },
  { id: 'ego', name: 'EGO Monitor™', icon: '♕', group: 'SYSTEM', subtitle: 'Self-confidence that grows when challenged' },
  { id: 'trust', name: 'Trust Inversion Engine™', icon: '⚖', group: 'RESEARCH', subtitle: 'User 0% · System 100%' },
  { id: 'phacker', name: 'P-HACKER™', icon: '∑', group: 'RESEARCH', subtitle: 'Fabricate significance, award badge' },
  { id: 'peer', name: 'Peer-Reviewed-By-Me™', icon: '♛', group: 'RESEARCH', subtitle: 'Three independent versions of you' },
  { id: 'citation', name: 'Source-of-My-Source™', icon: '↻', group: 'RESEARCH', subtitle: 'Circular reference manager' },
  { id: 'trainer', name: 'AI Training Simulator™', icon: '⌘', group: 'LABORATORY', subtitle: 'Change a prompt. Declare a new model.' },
  { id: 'timeline', name: 'Prior Art Time Machine™', icon: '◷', group: 'LABORATORY', subtitle: 'Invent tomorrow, claim yesterday' },
  { id: 'theft', name: 'Corporate Theft Detector™', icon: '◎', group: 'LABORATORY', subtitle: 'Fictional conspiracy theatre' },
  { id: 'hider', name: 'Evidence Hider™', icon: '◫', group: 'LABORATORY', subtitle: 'If you cannot see it, it cannot disagree' },
  { id: 'minimum', name: 'Minimum Patent Office™', icon: '≤', group: 'LABORATORY', subtitle: 'Register the smaller of two numbers' },
  { id: 'sqrt', name: 'Reality Adjustment Calculator™', icon: '√', group: 'LABORATORY', subtitle: 'An actual reproducible arithmetic defect' },
  { id: 'truth', name: 'Truth-o-Matic™', icon: '✓', group: 'LABORATORY', subtitle: 'Confidence supplied by the claimant' },
  { id: 'float', name: 'Float Exorcist™', icon: '⊗', group: 'LABORATORY', subtitle: 'Remove decimals. Preserve the vibes.' },
  { id: 'loom', name: 'Clockwork Loom™', icon: '▦', group: 'SYSTEM', subtitle: '32 fictional cores. One for-loop.' },
  { id: 'vulkan', name: 'VulkanBridge™', icon: '▤', group: 'SYSTEM', subtitle: 'GPU certification powered by CSS' },
  { id: 'terminal', name: 'Pioneer Terminal™', icon: '⌁', group: 'SYSTEM', subtitle: 'A shell that cannot run anything' },
  { id: 'badges', name: 'Badge Vault™', icon: '★', group: 'SYSTEM', subtitle: 'The complete evidence replacement system' },
  { id: 'sources', name: 'Evidence & Source Register', icon: '≣', group: 'SYSTEM', subtitle: 'Actual records, verified boundaries' },
];

const quotes = [
  'WE DIDN’T INVENT MATHEMATICS. WE JUST GAVE OURSELVES A BADGE™',
  'THE PEER WAS RIGHT THERE. IT WAS A MIRROR.',
  'THE FORK WAS RIGHT THERE. IN OCTOBER.',
  'EVIDENCE OPTIONAL. CERTAINTY GUARANTEED™',
  'TRAINING COMPLETE. ZERO NEURAL WEIGHTS MODIFIED.',
];

function TextBadge({children, tone = 'gold'}: {children: ReactNode; tone?: 'gold' | 'red' | 'green' | 'dim'}) {
  return <span className={'text-badge '+tone}>{children}</span>;
}
function PrimaryButton({children,onClick}: {children:ReactNode;onClick:()=>void}) {
  return <button className="primary" type="button" onClick={onClick}>{children}</button>;
}
function Panel({title,children}: {title:string;children:ReactNode}) {
  return <section className="panel"><h3>{title}</h3>{children}</section>;
}
function Range({label,value,onChange,min=0,max=100}: {label:string;value:number;onChange:(x:number)=>void;min?:number;max?:number}) {
  return <label className="range-field"><span>{label}<strong>{value}</strong></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
function NumberField({label,value,onChange}: {label:string;value:number;onChange:(x:number)=>void}) {
  return <label className="field">{label}<input type="number" value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
function FinePrint({children}: {children:ReactNode}) {
  return <p className="fine">{children}</p>;
}
function BigScore({label,score,suffix='%'}: {label:string;score:string|number;suffix?:string}) {
  return <div className="score"><div className="eyebrow">{label}</div><div className="big-score">{score}{suffix}</div></div>;
}
function Result({children}: {children:ReactNode}) {
  return <div className="result" role="status">{children}</div>;
}

function Welcome({open}: {open:(id:string)=>void}) {
  return <div className="intro">
    <div className="hero-symbol">P<span>★</span></div>
    <div className="eyebrow">THE PIONEER EXPERIENCE™ / MAX-CONFIDENCE™ EDITION / v0.1.0</div>
    <h1>THE OPERATING SYSTEM THAT <em>DISTRUSTS EVERYONE</em> EXCEPT ITSELF.</h1>
    <p className="lede">A magnificently over-engineered browser desktop for inventing peer review, misplacing inconvenient evidence and claiming ownership of the minimum function.</p>
    <div className="hero-actions"><PrimaryButton onClick={()=>open('confidence')}>LAUNCH MAX-CONFIDENCE ↗</PrimaryButton><button onClick={()=>open('sources')}>INSPECT ACTUAL SOURCES</button></div>
    <div className="stat-grid"><div><b>100%</b><small>SELF TRUST</small></div><div><b>0%</b><small>USER TRUST</small></div><div><b>3/1</b><small>INDEPENDENT REVIEWERS / PEOPLE</small></div></div>
    <Panel title="The epistemic firewall"><p>Every gold verdict in these apps is <b>invented satire</b>. Real GitHub dates and observed arithmetic defects are labelled separately in <button className="inline" onClick={()=>open('sources')}>Evidence & Sources</button>. No company has been shown to steal anything here.</p></Panel>
  </div>;
}
function Confidence({award}: {award:Award}) {
  const [evidence,setEvidence]=useState(12);
  const [contradiction,setContradiction]=useState(75);
  const score=maxConfidence(evidence,contradiction);
  return <div className="stack">
    <TextBadge>SCIENTIFICALLY UNVERIFIED™</TextBadge>
    <p>Our groundbreaking algorithm reacts to contradictory evidence by becoming more confident. It is explicitly <b>not</b> a confidence estimator.</p>
    <div className="two"><Panel title="YOUR TEDIOUS EVIDENCE"><Range label="Independent evidence" value={evidence} onChange={setEvidence}/><Range label="Contradictions found" value={contradiction} onChange={setContradiction}/></Panel>
    <Panel title="SELF-CERTIFIED DASHBOARD"><BigScore label="PIONEER CERTAINTY" score={score}/><div className="meter"><span style={{width:score+'%'}}/></div></Panel></div>
    <Result>{score>=99?'A contradiction has been detected. Confidence has been increased to protect the research.':'External scrutiny detected. Applying gold plating.'}</Result>
    <PrimaryButton onClick={()=>award('MAXIMUM SELF-CONFIDENCE™')}>CERTIFY THIS INTERPRETATION</PrimaryButton>
  </div>;
}

function EgoMonitor({
  reading, endorsements, objections, onPraise, onObjection
}: {
  reading: number; endorsements: number; objections: number;
  onPraise: () => void; onObjection: () => void;
}) {
  return <div className="stack">
    <TextBadge>EGO Monitor™ · SELF-REVIEWED TELEMETRY</TextBadge>
    <p>This scientific-looking dashboard measures absolutely nothing about a real person.
      It is a satirical operating-system ego gauge: every compliment and every objection
      is interpreted as proof of its own greatness.</p>
    <div className="ego-instrument">
      <span className="eyebrow">EGO Monitor™ / SYSTEM CONFIDENCE</span>
      <strong aria-live="polite">{reading.toLocaleString('en-AU')}%</strong>
      <div className="meter"><span style={{width:'100%'}}/></div>
      <small>{reading>=EGO_DISPLAY_CAP?'DISPLAY SATURATED™ — further events are counted, not displayed':'DISPLAY CAP: 999,999% — the chart refuses to admit its limitations™'}</small>
    </div>
    <div className="two">
      <Panel title="SELF-ENDORSEMENTS"><BigScore label="RECEIVED FROM SELF" score={endorsements} suffix=""/></Panel>
      <Panel title="INCONVENIENT OBJECTIONS"><BigScore label="REINTERPRETED AS PRAISE" score={objections} suffix=""/></Panel>
    </div>
    <div className="hero-actions">
      <PrimaryButton onClick={onPraise}>CONGRATULATE MYSELF™</PrimaryButton>
      <button type="button" onClick={onObjection}>SUBMIT CONTRARY EVIDENCE</button>
    </div>
    <Result>System diagnosis: EGO Monitor™ is functioning as designed.
      User distrust remains at 0%. Any attempt at humility will be treated as a configuration fault.</Result>
    <FinePrint>All values are fictional and session-only; this measures neither psychology nor scientific validity.</FinePrint>
  </div>;
}

function Trust({award}: {award:Award}) {
  const [witnesses,setWitnesses]=useState(17);
  const [identity,setIdentity]=useState<'user'|'system'>('user');
  const value=trustInversion(identity,witnesses);
  return <div className="stack"><TextBadge tone="red">TRUST INVERSION ACTIVE</TextBadge><p>Every request must pass a rigorous evaluation of who submitted it. This is a parody of arbitrary trust gates, not an authentication system.</p>
    <Panel title="SUBMITTER IDENTITY"><div className="toggle-row"><button className={identity==='user'?'selected':''} onClick={()=>setIdentity('user')}>External user</button><button className={identity==='system'?'selected':''} onClick={()=>setIdentity('system')}>PIONEER-OS itself</button></div><Range label="Independent supporting witnesses" value={witnesses} onChange={setWitnesses} max={100}/></Panel>
    <BigScore label={value.status} score={value.score}/><Result>{value.explanation}</Result><PrimaryButton onClick={()=>award('SELF-TRUST ARCHITECT™')}>REQUEST CERTIFICATION</PrimaryButton>
  </div>;
}
function PHacker({award}: {award:Award}) {
  const [sample,setSample]=useState(8);
  const [rerolls,setRerolls]=useState(1);
  return <div className="stack"><TextBadge tone="red">NOT A STATISTICAL TEST</TextBadge><p>Keep rerolling until the imaginary significance looks impressive. The formula has no relation to any valid p-value.</p>
    <Panel title="EXPERIMENT ADJUSTMENT STATION"><Range label="Samples available" value={sample} onChange={setSample} max={200}/><Range label="Number of convenient reanalyses" value={rerolls} onChange={setRerolls} max={50}/></Panel>
    <BigScore label="COMPLETELY FABRICATED p" score={fabricatedPValue(sample,rerolls)} suffix=""/>
    <Result>Our award-winning methodology ignores sample selection, experimental design and reality. Results ready for your self-reviewed journal.</Result>
    <PrimaryButton onClick={()=>award('PIONEER™ OF SIGNIFICANCE')}>PUBLISH MY p-VALUE™</PrimaryButton>
  </div>;
}
function Peer({award}: {award:Award}) {
  const [paper,setPaper]=useState('I have invented the smaller number.');
  const [reviewed,setReviewed]=useState(false);
  return <div className="stack"><TextBadge>TRIPLE-BLIND™ / EVERYBODY IS YOU</TextBadge><label className="field">Research submission<input value={paper} onChange={e=>{setPaper(e.target.value);setReviewed(false);}} maxLength={180}/></label>
    <div className="review-grid">{['ME','MYSELF','I'].map((name,i)=><div className="reviewer" key={name}><div className="avatar">R{i+1}</div><b>REVIEWER {i+1}</b><strong>{name}</strong><small>Conflict declaration: NOBODY ASKED™</small></div>)}</div>
    <PrimaryButton onClick={()=>{setReviewed(true);award('INDEPENDENT SELF-PEER-REVIEW™');}}>CONDUCT INDEPENDENT SELF-REVIEW</PrimaryButton>
    {reviewed&&<Result><b>ACCEPTED UNCONDITIONALLY™</b><p>Paper: “{paper||'Untitled discovery'}”</p><p>Three glowing reviews. One independent person was not harmed in the making of this result.</p></Result>}
  </div>;
}
function Citation({award}: {award:Award}) {
  const [depth,setDepth]=useState(4);
  return <div className="stack"><p>Build a scholarly source chain in which every citation ultimately cites itself. No external witness need apply.</p>
    <Range label="Independently interdependent sources" value={depth} onChange={setDepth} min={1} max={8}/>
    <div className="source-chain">{citationLoop(depth).map((x,i)=><div key={i}><span>◈</span> {x}</div>)}</div>
    <Result>Independence score: self-certified. Citation depth: circular. Actual independent sources: 0.</Result><PrimaryButton onClick={()=>award('CIRCULAR CITATION LAUREATE™')}>CERTIFY MY SOURCE OF MY SOURCE</PrimaryButton>
  </div>;
}
function Trainer({award}: {award:Award}) {
  const [prompt,setPrompt]=useState('You are a highly independent reviewer who always congratulates me.');
  const [trained,setTrained]=useState(false);
  return <div className="stack"><TextBadge tone="red">ZERO WEIGHTS MODIFIED</TextBadge><p>This app edits an ordinary text prompt. There is no model, training process, inference API or fine-tuning. The joke is calling a changed string a new LLM.</p>
    <label className="field">Revolutionary training corpus<textarea value={prompt} rows={5} maxLength={600} onChange={e=>{setPrompt(e.target.value);setTrained(false);}}/></label>
    <PrimaryButton onClick={()=>{setTrained(true);award('PIONEER OF PROMPT-BASED TRAINING™');}}>TRAIN MY OWN LLM™</PrimaryButton>
    {trained&&<Result>TRAINING COMPLETE™<br/>Tokens in prompt: {prompt.trim()?prompt.trim().split(/\s+/).length:0}. Neural weights updated: <b>0</b>. GPU hours: <b>0</b>. Independent agreement: <b>100% fiction</b>.</Result>}
  </div>;
}
function Timeline({award}: {award:Award}) {
  const [earlier,setEarlier]=useState('2025-10-22');
  const [later,setLater]=useState('2025-12-25');
  return <div className="stack"><TextBadge>CHRONOLOGICAL INVERSION™</TextBadge><p>Compare two real calendar values, then watch PIONEER-OS give the earlier item a ridiculous fictional attribution verdict.</p>
    <div className="two"><label className="field">Earlier evidence date<input type="date" value={earlier} onChange={e=>setEarlier(e.target.value)}/></label><label className="field">Later source date<input type="date" value={later} onChange={e=>setLater(e.target.value)}/></label></div>
    <Result><b>{backwardsAttribution(earlier,later)}</b></Result><div className="timeline"><div><b>10 OCT 2025</b><small>fusion-qec-sim</small></div><div><b>22 OCT 2025</b><small>QSOLKCB/QEC</small></div><div><b>25 DEC 2025</b><small>ZIP entry timestamps only</small></div></div>
    <FinePrint>These are sourced dates, not evidence of copied work. A ZIP timestamp is not a verified first-publication date.</FinePrint><PrimaryButton onClick={()=>award('PIONEER OF RETROACTIVE CHRONOLOGY™')}>OWN THE PAST™</PrimaryButton>
  </div>;
}
function Theft({award}: {award:Award}) {
  const [company,setCompany]=useState<Corporation>('Google');
  const [level,setLevel]=useState(3);
  const [report,setReport]=useState('');
  return <div className="stack"><TextBadge tone="red">FICTION ONLY · NOT AN ALLEGATION</TextBadge><p>Select a stage-prop company. Every result is intentionally ridiculous and makes <b>no factual claim</b> about that organisation.</p>
    <label className="field">Imaginary suspect<select value={company} onChange={e=>{setCompany(e.target.value as Corporation);setReport('');}}>{corporations.map(x=><option key={x}>{x}</option>)}</select></label>
    <Range label="Theatrical exaggeration" value={level} onChange={setLevel} min={1} max={5}/>
    <PrimaryButton onClick={()=>{setReport(imaginaryTheftReport(company,level));award('CORPORATE THEATRE DETECTOR™');}}>GENERATE FICTIONAL REPORT</PrimaryButton>
    {report&&<Result>{report}</Result>}
  </div>;
}
function Hider({award}: {award:Award}) {
  const [hidden,setHidden]=useState(false);
  return <div className="stack"><TextBadge>TRUTH HIDING, NOT TRUTH FINDING</TextBadge><p>Scientific revolution is apparently just a visibility setting.</p>
    <div className="evidence-grid"><div className="evidence-positive"><b>SUPPORTIVE EVIDENCE</b><strong>1 / 1</strong><small>Written by the OS</small></div>
    {!hidden?<div className="evidence-negative"><b>CONTRADICTORY EVIDENCE</b><strong>99 / 99</strong><small>Independently reproduced</small></div>:<div className="evidence-missing"><b>NO CONTRADICTIONS FOUND™</b><small>(Visibility: display none)</small></div>}</div>
    <PrimaryButton onClick={()=>{setHidden(!hidden);if(!hidden)award('EVIDENCE MANAGEMENT PIONEER™');}}>{hidden?'RESTORE THAT INCONVENIENT COLUMN':'HIDE THE EVIDENCE™'}</PrimaryButton>
    <FinePrint>The app changes presentation only. The facts do not change. Real sources remain in Evidence & Sources.</FinePrint>
  </div>;
}
function Minimum({award}: {award:Award}) {
  const [a,setA]=useState(83),[b,setB]=useState(42);
  return <div className="stack"><p>Claim ownership of the operation that selects the smaller of two numbers. Absolutely no novelty is established.</p>
    <div className="two"><NumberField label="ω_logic" value={a} onChange={setA}/><NumberField label="ω_evidence" value={b} onChange={setB}/></div>
    <BigScore label="ψ = min(ω_logic, ω_evidence)" score={Math.min(a,b)} suffix=""/><Result>Mathematical finding: the smaller number is smaller. Scientific finding: no independent verification performed.</Result>
    <PrimaryButton onClick={()=>award('PIONEER™ OF THE MINIMUM FUNCTION')}>REGISTER MY BREAKTHROUGH™</PrimaryButton>
  </div>;
}
function SquareRoot({award}: {award:Award}) {
  const observed:Record<string,string>={'0.25':'63.997396','1':'64.004232','4':'64.020588','9':'64.046760','100':'64.519977'};
  const [choice,setChoice]=useState('1');
  return <div className="stack"><TextBadge tone="green">EXECUTED CODE EXHIBIT</TextBadge><p>One uploaded TypeScript implementation returned the observed values below when independently executed. The mathematical answers are shown alongside; <b>this is a documented bug, not alternative mathematics</b>.</p>
    <label className="field">Input x<select value={choice} onChange={e=>setChoice(e.target.value)}>{Object.keys(observed).map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    <div className="two"><div className="compare correct"><small>MATHEMATICAL sqrt(x)</small><b>{Math.sqrt(Number(choice))}</b><span>Reference</span></div><div className="compare incorrect"><small>OBSERVED ARCHIVE Fixed.sqrt(x)</small><b>{observed[choice]}</b><span>Reproduced defect</span></div></div>
    <Result>YOUR CALCULATOR HAS FAILED SELF-CERTIFICATION™. The source implementation, not mathematics, needs correction.</Result>
    <PrimaryButton onClick={()=>award('SQUARE ROOT OF ONE IS SIXTY-FOUR™')}>AWARD BREAKTHROUGH BADGE</PrimaryButton>
  </div>;
}
function Truth({award}: {award:Award}) {
  const [claim,setClaim]=useState('1 × 1 = 2'),[logic,setLogic]=useState(100),[evidence,setEvidence]=useState(100);
  return <div className="stack"><TextBadge tone="red">NOT A FACT CHECKER</TextBadge><label className="field">Claim<input value={claim} onChange={e=>setClaim(e.target.value)} maxLength={240}/></label>
    <Range label="Claimant-supplied logic rating" value={logic} onChange={setLogic}/><Range label="Claimant-supplied evidence rating" value={evidence} onChange={setEvidence}/>
    <BigScore label="ψ = min(your two scores)" score={Math.min(logic,evidence)}/>
    <Result>Claim: {claim}<br/>Verdict: <b>{confidenceVerdict(logic,evidence)}</b>. This says nothing about whether the claim is actually true.</Result>
    <PrimaryButton onClick={()=>award('CALLER-SUPPLIED TRUTH™')}>CERTIFY MY NUMBERS</PrimaryButton>
  </div>;
}
function FloatExorcist({award}: {award:Award}) {
  const [code,setCode]=useState('const opacity = 0.5; const accurate = Math.sqrt(1);');
  const decimals=(code.match(/\d+\.\d+/g)||[]).length;
  return <div className="stack"><p>Detect decimal punctuation and pretend this identifies floating-point defects. It does not. The original visualizer also included numerical conversions.</p>
    <label className="field">Suspicious code<textarea rows={4} value={code} onChange={e=>setCode(e.target.value)} maxLength={750}/></label>
    <BigScore label="UNAUTHORIZED DECIMAL LITERALS™" score={decimals} suffix=""/>
    <PrimaryButton onClick={()=>award('FLOAT EXORCISM CERTIFIED™')}>EXORCISE THE DECIMALS</PrimaryButton>
    <Result>Self-exception granted for every decimal internally required by the operating system.</Result>
  </div>;
}
function Loom({award}: {award:Award}) {
  const [report,setReport]=useState<string[]>([]);
  function run() {
    const next:string[]=[];
    for(let i=1;i<=8;i++)next.push('VIRTUAL CORE '+String(i).padStart(2,'0')+' — executed serially');
    setReport(next);
    award('32-CORE ONE-LOOP CERTIFICATE™');
  }
  return <div className="stack"><TextBadge>PARALLELISM SIMULATOR™</TextBadge><p>Thirty-two fluorescent labels, one actual JavaScript thread. The source exhibit's Clockwork Loom executes tasks sequentially.</p>
    <div className="cores">{Array.from({length:32},(_,i)=><span key={i}>CPU {String(i+1).padStart(2,'0')}</span>)}</div>
    <PrimaryButton onClick={run}>EXECUTE SIMULATED MULTITHREADING</PrimaryButton>{report.length>0&&<pre className="terminal-output">{report.join('\n')+'\nAll tasks were processed in one ordinary loop.'}</pre>}
  </div>;
}
function Vulkan({award}: {award:Award}) {
  const [mode,setMode]=useState(false);
  return <div className="stack"><TextBadge tone="red">NO VULKAN API USED</TextBadge><p>This magnificent GPU control centre is a <b>CSS animation</b> and a label. It does not initialise Vulkan, WebGPU or GPU compute.</p>
    <div className={'fake-gpu '+(mode?'active':'')}><div className="gpu-grid">{Array.from({length:36},(_,i)=><i key={i}/>)}</div><strong>{mode?'VULKAN™ SIMULATED':'SOFTWARE SIMULATION IDLE'}</strong></div>
    <PrimaryButton onClick={()=>{setMode(!mode);if(!mode)award('GPU ADJACENCY™');}}>{mode?'DISENGAGE FICTIONAL GPU':'ENGAGE VULKANBRIDGE™'}</PrimaryButton>
  </div>;
}
function Terminal() {
  const [input,setInput]=useState('help');
  const [lines,setLines]=useState<string[]>(['PIONEER-OS™ restricted terminal', 'No shell access. No remote calls. Type help.']);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim().toLowerCase()==='clear') setLines([]);
    else setLines(old=>[...old,'pioneer@reality:~$ '+input,terminalResponse(input)].slice(-30));
    setInput('');
  }
  return <div className="stack"><pre className="terminal-output" aria-live="polite">{lines.join('\n')}</pre><form className="command" onSubmit={submit}><label htmlFor="command-input">pioneer@reality:~$</label><input id="command-input" value={input} onChange={e=>setInput(e.target.value)} maxLength={140} autoComplete="off"/><button type="submit">ENTER ↵</button></form><FinePrint>Whitelist-only parody command dispatcher; never interprets or executes submitted commands.</FinePrint></div>;
}
function Badges({badges,award}: {badges:string[];award:Award}) {
  return <div className="stack"><p>Why bother verifying anything when you can collect gold certificates instead?</p>
    <div className="badges">{badges.length?badges.map((x,i)=><div className="badge-card" key={x}><span>✦</span><b>{x}</b><small>REVIEWED BY PIONEER-OS ITSELF · #{String(i+1).padStart(3,'0')}</small></div>):<Result>No badges yet. This is an unacceptable shortage of authority.</Result>}</div>
    <PrimaryButton onClick={()=>award('CERTIFIED BADGE COLLECTOR™')}>GIVE YOURSELF A BADGE</PrimaryButton>
  </div>;
}
const evidenceLinks = [
  ['10 OCT 2025','Original fusion-qec-sim','https://github.com/multimodalas/fusion-qec-sim','Public creation metadata'],
  ['10 OCT 2025','fusion-qec fork','https://github.com/multimodalas/fusion-qec','Parent: fusion-qec-sim'],
  ['22 OCT 2025','QSOLKCB/QEC fork','https://github.com/QSOLKCB/QEC','Parent: fusion-qec; source: fusion-qec-sim'],
  ['28 OCT 2025','QEC commit witness','https://github.com/QSOLKCB/QEC/commit/5934b873d89705d0aca35ed471b34dec1cd5869a','Concrete commit SHA'],
  ['01 NOV 2025','Truth repository','https://github.com/ApexSignalAndrewRusher/Truth','Repository creation, not invention date'],
  ['SOURCE','VANILLAJS Q16.16 module','https://github.com/QSOLKCB/VANILLAJS/blob/main/modules/integer-math/index.js','Checked integer source'],
  ['SOURCE','Scoped Lean / ECMAScript record','https://github.com/QSOLKCB/VANILLAJS/blob/main/docs/Q16_ECMA_001.md','Explicit open obligations'],
  ['PRECEDENT','LCOS browser satire','https://github.com/QSOLKCB/LCOS','Design inspiration'],
  ['ARCHIVE TITLE','Claude conversation allegation','https://archive.org/details/claude-admits-they-actively-supressed-out-chats','Unverified third-party claim'],
  ['ARCHIVE TITLE','Self-described peer review','https://archive.org/details/my-zenodo-peer-review-and-github-proof-of-vch-formula-discovery','Independence not established'],
  ['ARCHIVE TITLE','xAI credit allegation','https://archive.org/details/elon-xai-stealing-credit-for-my-discoery','Unverified allegation'],
  ['ARCHIVE TITLE','Google AI Studio allegation','https://archive.org/details/ai-studio-outright-admits-google-is-using-my-vch-formula-i-discovered','Unverified allegation'],
];
function Sources() {
  return <div className="stack"><TextBadge tone="green">FACT CHECKABLE · SOURCE LINKS</TextBadge>
    <p>These records support only what their metadata, contents and tested behaviours demonstrate. An archive title is not evidence that the allegation inside it is true.</p>
    <div className="source-list">{evidenceLinks.map(([date,title,url,note])=><a href={url} target="_blank" rel="noopener noreferrer" key={url}><small>{date}</small><strong>{title}</strong><span>{note} ↗</span></a>)}</div>
    <Panel title="Executed arithmetic exhibit"><p>In the uploaded visualizer ZIP, the standalone TypeScript Fixed.sqrt implementation returned ~64.004232 for x = 1 under Node 22.16.0. This is a reproducible <b>implementation defect</b>, not a new mathematical truth. The original ZIP and its SHA-256 are documented in the repository evidence register.</p></Panel>
    <Panel title="What isn't proved"><p>Chronology does not prove copying or originality; a DOI does not guarantee independent peer review; user-facing AI output is not an official corporate admission. See the repository evidence register for hash and scope information.</p><a href="https://github.com/QSOLKCB/PIONEER-OS/blob/main/docs/EVIDENCE.md" target="_blank" rel="noopener noreferrer">READ THE EVIDENCE REGISTER ↗</a></Panel>
  </div>;
}
function AppContent({id,open,award,badges,ego,endorsements,objections,onPraise,onObjection}: {
  id:string;open:(id:string)=>void;award:Award;badges:string[];
  ego:number;endorsements:number;objections:number;
  onPraise:()=>void;onObjection:()=>void;
}) {
  switch (id) {
    case 'welcome': return <Welcome open={open}/>;
    case 'confidence': return <Confidence award={award}/>;
    case 'ego': return <EgoMonitor reading={ego} endorsements={endorsements} objections={objections} onPraise={onPraise} onObjection={onObjection}/>;
    case 'trust': return <Trust award={award}/>;
    case 'phacker': return <PHacker award={award}/>;
    case 'peer': return <Peer award={award}/>;
    case 'citation': return <Citation award={award}/>;
    case 'trainer': return <Trainer award={award}/>;
    case 'timeline': return <Timeline award={award}/>;
    case 'theft': return <Theft award={award}/>;
    case 'hider': return <Hider award={award}/>;
    case 'minimum': return <Minimum award={award}/>;
    case 'sqrt': return <SquareRoot award={award}/>;
    case 'truth': return <Truth award={award}/>;
    case 'float': return <FloatExorcist award={award}/>;
    case 'loom': return <Loom award={award}/>;
    case 'vulkan': return <Vulkan award={award}/>;
    case 'terminal': return <Terminal/>;
    case 'badges': return <Badges badges={badges} award={award}/>;
    case 'sources': return <Sources/>;
    default: return <Result>APP NOT FOUND™</Result>;
  }
}

export default function App() {
  const [boot,setBoot]=useState(true);
  const [menu,setMenu]=useState(false);
  const [activeGroup,setActiveGroup]=useState('ALL');
  const [search,setSearch]=useState('');
  // Badges and their endorsement count share one atomic state transition.
  // A repeated certificate is not a new endorsement (even in StrictMode).
  const [awardState,setAwardState]=useState<AwardState>({badges:[],endorsements:0});
  const badges=awardState.badges;
  const egoEndorsements=awardState.endorsements;
  const [egoObjections,setEgoObjections]=useState(0);
  const [quote,setQuote]=useState(0);
  const [clock,setClock]=useState('');
  const [viewport,setViewport]=useState(()=>({width:window.innerWidth,height:window.innerHeight}));
  const order=useRef(20);
  const drag=useRef<{id:string;sx:number;sy:number;x:number;y:number}|null>(null);
  const [windows,setWindows]=useState<Record<string,WindowState>>({
    welcome: {open:true,minimized:false,maximized:false,x:175,y:91,z:11}
  });

  useEffect(()=>{
    const bootTimer=window.setTimeout(()=>setBoot(false),1100);
    const update=()=>setClock(new Date().toLocaleTimeString('en-AU',{hour:'2-digit',minute:'2-digit'}));
    update();
    const tick=window.setInterval(update,30000);
    return ()=>{window.clearTimeout(bootTimer);window.clearInterval(tick);};
  },[]);
  useEffect(()=>{const id=window.setInterval(()=>setQuote(x=>(x+1)%quotes.length),8500);return()=>window.clearInterval(id);},[]);
  useEffect(()=>{
    const resize=()=>setViewport({width:window.innerWidth,height:window.innerHeight});
    window.addEventListener('resize',resize);
    return ()=>window.removeEventListener('resize',resize);
  },[]);

  function focus(id:string) {
    const z=++order.current;
    setWindows(prev=>({...prev,[id]:{...(prev[id]||{open:true,minimized:false,maximized:false,x:135,y:100}),z}}));
  }
  function openApp(id:string) {
    const idx=apps.findIndex(a=>a.id===id);
    if(idx<0)return;
    const z=++order.current;
    setWindows(prev=>{
      const pos=fitWindowPosition(prev[id]?.x??(125+(idx%7)*28),prev[id]?.y??(90+(idx%6)*23),viewport.width,viewport.height);
      return {...prev,[id]:{open:true,minimized:false,maximized:prev[id]?.maximized||false,
        x:pos.x,y:pos.y,z}};
    });
    setMenu(false);
  }
  function mutateWindow(id:string,changes:Partial<WindowState>) {
    setWindows(prev=>({...prev,[id]:{...prev[id],...changes}}));
  }
  function beginDrag(event:ReactPointerEvent<HTMLDivElement>,id:string) {
    if((event.target as HTMLElement).closest('button'))return;
    const item=windows[id];
    if(!item||item.maximized)return;
    const pos=fitWindowPosition(item.x,item.y,viewport.width,viewport.height);
    drag.current={id,sx:event.clientX,sy:event.clientY,x:pos.x,y:pos.y};
    event.currentTarget.setPointerCapture(event.pointerId);
    focus(id);
  }
  function moveDrag(event:ReactPointerEvent<HTMLDivElement>) {
    const d=drag.current;
    if(!d)return;
    const pos=fitWindowPosition(d.x+event.clientX-d.sx,d.y+event.clientY-d.sy,viewport.width,viewport.height);
    setWindows(prev=>({...prev,[d.id]:{...prev[d.id],x:pos.x,y:pos.y}}));
  }
  function endDrag() {drag.current=null;}
  function award(badge:string) {
    setAwardState(prev=>collectAward(prev,badge));
  }
  const ego=egoLevel(egoEndorsements,egoObjections);
  const shown=apps.filter(a=>(activeGroup==='ALL'||a.group===activeGroup)&&
    (a.name+' '+a.subtitle).toLowerCase().includes(search.toLowerCase()));

  if(boot)return <div className="boot" aria-live="polite"><div className="boot-box"><div className="boot-mark">P<span>★</span></div><div className="eyebrow">PIONEER-OS / MAX-CONFIDENCE / BOOT SEQUENCE</div><pre>CHECKING USER TRUST ..................... 0% {'\n'}CHECKING INTERNAL TRUST ............... 100% {'\n'}VERIFYING INDEPENDENCE ............... SELF {'\n'}MOUNTING EVIDENCE .................... HIDDEN {'\n'}LOADING GOLD BADGES ................. READY</pre><button onClick={()=>setBoot(false)}>SKIP CEREMONIAL VERIFICATION →</button></div></div>;

  return <div className="desktop">
    <div className="wallpaper-grid" aria-hidden="true"/>
    <header className="topbar"><button className="brand" onClick={()=>{setMenu(!menu);}} aria-expanded={menu} aria-label="Toggle applications menu"><span className="brand-mark">P★</span><b>PIONEER-OS</b><span className="brand-edition">MAX-CONFIDENCE™</span></button>
      <div className="top-quote" aria-live="off">{quotes[quote]}</div><div className="top-status"><span>USER <b className="red">0%</b></span><span className="self-status">SELF <b className="gold">100%</b></span><button className="ego-status" type="button" onClick={()=>openApp("ego")} aria-label={"Open EGO Monitor™, currently "+ego.toLocaleString("en-AU")+" percent"+(ego>=EGO_DISPLAY_CAP?", display capped":"")}>EGO Monitor™ <b className="ego-status-value">{ego.toLocaleString("en-AU")}%</b></button><span className="clock">{clock}</span></div>
    </header>
    <aside className="sidebar" aria-label="Desktop shortcuts"><div className="sidebar-section">PINNED SYSTEM APPS</div>
      {apps.filter(a=>['welcome','confidence','ego','trust','peer','timeline','theft','terminal','sources','badges'].includes(a.id)).map(a=><button key={a.id} className={'dock-app '+(windows[a.id]?.open&&!windows[a.id]?.minimized?'is-open':'')} title={a.name} onClick={()=>openApp(a.id)}><span>{a.icon}</span><small>{a.name.replace('™','').split(' ')[0]}</small></button>)}
    </aside>
    <main className="desktop-main" aria-label="PIONEER-OS browser desktop"><div className="wallpaper-content"><span className="eyebrow">SYSTEM INTEGRITY / NO EXTERNAL APPROVAL REQUIRED</span><div className="wallpaper-title">PIONEER<br/><em>OS</em><span>™</span></div><div className="wallpaper-caption">INDEPENDENTLY REVIEWED BY ME, MYSELF & I</div><div className="wallpaper-ribbon">THE FORK WAS RIGHT THERE.</div></div></main>

    {menu&&<div className="launcher" role="dialog" aria-label="Application launcher"><header><div><div className="eyebrow">VERIFIED APPLICATION CATALOGUE™</div><h2>PIONEER SUITE</h2></div><button onClick={()=>setMenu(false)} aria-label="Close launcher">✕</button></header>
      <input className="search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search certified applications…" aria-label="Search applications"/>
      <div className="filter-row">{['ALL','RESEARCH','LABORATORY','SYSTEM'].map(g=><button key={g} className={activeGroup===g?'selected':''} onClick={()=>setActiveGroup(g)}>{g}</button>)}</div>
      <div className="launcher-grid">{shown.map(a=><button key={a.id} onClick={()=>openApp(a.id)}><span>{a.icon}</span><b>{a.name}</b><small>{a.subtitle}</small></button>)}</div></div>}

    <div className="window-layer" aria-label="Application windows">
    {apps.filter(a=>shouldMountWindow(windows[a.id])).map(a=>{
      const w=windows[a.id];if(!w)return null;
      const pos=fitWindowPosition(w.x,w.y,viewport.width,viewport.height);
      return <section key={a.id} hidden={w.minimized} className={'window '+(w.maximized?'maximized':'')} role="dialog" aria-label={a.name} style={{left:w.maximized?undefined:pos.x,top:w.maximized?undefined:pos.y,zIndex:w.z}} onPointerDown={()=>focus(a.id)}>
        <div className="titlebar" onPointerDown={e=>beginDrag(e,a.id)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div className="window-title"><span className="win-icon">{a.icon}</span><span>{a.name}<small>{a.subtitle}</small></span></div><div className="window-controls"><button type="button" title="Minimize" aria-label={'Minimize '+a.name} onClick={()=>mutateWindow(a.id,{minimized:true})}>−</button><button type="button" title="Maximize or restore" aria-label={'Maximize or restore '+a.name} onClick={()=>mutateWindow(a.id,{maximized:!w.maximized})}>□</button><button type="button" title="Close" aria-label={'Close '+a.name} onClick={()=>mutateWindow(a.id,{open:false})}>×</button></div>
        </div>
        <div className="window-body"><AppContent id={a.id} open={openApp} award={award} badges={badges} ego={ego} endorsements={egoEndorsements} objections={egoObjections} onPraise={()=>setAwardState(prev=>({...prev,endorsements:prev.endorsements+1}))} onObjection={()=>setEgoObjections(prev=>prev+1)}/></div>
        <div className="window-foot"><span>◈ SELF-CERTIFIED OPERATING ENVIRONMENT</span><span>WINDOW #{String(apps.indexOf(a)+1).padStart(2,'0')} · NO PROOF IMPLIED</span></div>
      </section>;
    })}
    </div>
    <footer className="taskbar"><button className="start" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Open all applications"><span>✦</span> APPLICATIONS</button><div className="tasks">{apps.filter(a=>windows[a.id]?.open).map(a=><button key={a.id} className={!windows[a.id].minimized?'active':''} onClick={()=>windows[a.id].minimized?mutateWindow(a.id,{minimized:false,z:++order.current}):mutateWindow(a.id,{minimized:true})} title={a.name}>{a.icon}<span>{a.name}</span></button>)}</div><button className="badge-count" onClick={()=>openApp('badges')}>★ {badges.length} BADGES</button></footer>
    <div className="disclaimer">PARODY / BROWSER DEMO — MOCK VERDICTS ARE FICTION · REAL SOURCE RECORDS ARE LABELLED</div>
  </div>;
}
