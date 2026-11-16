import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fitWindowPosition, shouldMountWindow } from '../src/windowGeometry.ts';

test('minimized app remains mounted; only closing unmounts its state',()=>{
  assert.equal(shouldMountWindow({open:true,minimized:false}),true);
  assert.equal(shouldMountWindow({open:true,minimized:true}),true);
  assert.equal(shouldMountWindow({open:false,minimized:false}),false);
  assert.equal(shouldMountWindow({open:false,minimized:true}),false);
});
test('the 621-900px tablet breakpoints keep every window control on screen',()=>{
  for(const width of [621,640,768,900]){
    const expectedWidth=width-103;
    for(const requestedX of [175,125,9999,-100]){
      const pos=fitWindowPosition(requestedX,91,width,800);
      assert.ok(pos.x>=87, 'sidebar remains visible');
      assert.ok(pos.x+expectedWidth<=width-8,
        'titlebar and close control fit at '+width+'px with x='+pos.x);
    }
  }
});
test('desktop preserves valid position and clamps extreme drag coordinates',()=>{
  assert.deepEqual(fitWindowPosition(175,91,1440,900),{x:175,y:91});
  assert.deepEqual(fitWindowPosition(99999,-99999,1440,900),{x:592,y:59});
  assert.deepEqual(fitWindowPosition(NaN,Infinity,1440,900),{x:87,y:59});
});
test('short tablet viewport protects taskbar and header',()=>{
  const pos=fitWindowPosition(900,500,768,600);
  assert.ok(pos.y>=59);
  assert.ok(pos.y+(600-150)<=600-66);
});
test('phone layout delegates placement to the fixed CSS layout',()=>{
  assert.deepEqual(fitWindowPosition(999,999,620,800),{x:61,y:56});
});
test('UI preserves component subtree while hidden and isolates z-index from launcher',()=>{
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(app,/hidden=\{w\.minimized\}/);
  assert.match(app,/filter\(a=>shouldMountWindow\(windows\[a\.id\]\)\)/);
  assert.match(css,/\.window\[hidden\]\{display:none!important\}/);
  assert.match(css,/\.window-layer\{[^}]*z-index:40;isolation:isolate/);
  assert.match(css,/\.launcher\{[^}]*z-index:210/);
});
