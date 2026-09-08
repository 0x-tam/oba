import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HandGestures } from '../lib/hand-gestures.ts';
function hand(x=.4,y=.4,ratio=.2){const h=Array.from({length:21},()=>({x,y}));h[0]={x,y:y+.2};h[9]={x,y};h[4]={x:x-ratio*.1,y};h[8]={x:x+ratio*.1,y};return h;}
function engaged(){const g=new HandGestures();g.update([hand()],0);g.update([hand()],40);g.update([hand()],80);return g;}
test('stationary tremor does not move the model',()=>{const g=engaged();for(let t=120;t<1000;t+=40){const r=g.update([hand(.4+(t%80?.001:-.001))],t);assert.equal(r.x,0);assert.equal(r.zoom,1);}});
test('deliberate movement rotates after engagement',()=>{const r=engaged().update([hand(.43)],120);assert.equal(r.mode,'rotate');assert.ok(r.x<0);assert.equal(r.zoom,1);});
test('hysteresis prevents pinch chatter; release freezes',()=>{const g=engaged();assert.equal(g.update([hand(.4,.4,.48)],120).mode,'rotate');const r=g.update([hand(.4,.4,.7)],160);assert.equal(r.mode,'ready');assert.equal(r.x,0);assert.equal(g.update([hand(.5)],200).mode,'arming');});
test('lost hand reacquires without jumping',()=>{const g=engaged();g.update([],120);const r=g.update([hand(.7)],160);assert.equal(r.x,0);assert.equal(r.mode,'arming');});
test('long gaps and out of order frames never replay movement',()=>{const g=engaged();assert.equal(g.update([hand(.5)],600).x,0);assert.equal(g.update([hand(.7)],590).x,0);});
test('a second open hand cannot accidentally zoom',()=>{const g=engaged();const r=g.update([hand(.42),hand(.75,.4,.9)],120);assert.equal(r.mode,'rotate');assert.equal(r.zoom,1);});
test('invalid landmarks are ignored',()=>{const g=engaged();assert.equal(g.update([[{x:NaN,y:0}]],120).mode,'searching');});

function fist(scale=1,x=.5,y=.5){
 const h=Array.from({length:21},()=>({x,y}));h[0]={x,y:y+.14*scale};
 for(const [mcp,offset] of [[5,-.07],[9,-.02],[13,.035],[17,.08]]){
  h[mcp]={x:x+offset*scale,y:y-.01*scale};h[mcp+1]={x:x+offset*scale,y:y-.045*scale};
  h[mcp+2]={x:x+offset*scale,y:y+.005*scale};h[mcp+3]={x:x+offset*scale,y:y+.055*scale};
 }h[4]={x:x-.055*scale,y:y+.05*scale};return h;
}
function engagedFist(){const g=new HandGestures();g.update([fist()],0);g.update([fist()],60);g.update([fist()],120);return g;}
test('closed fist pulling toward camera zooms in',()=>{const r=engagedFist().update([fist(1.08)],160);assert.equal(r.mode,'zoom');assert.ok(r.zoom<1);assert.equal(r.x,0);});
test('closed fist pushing away zooms out',()=>{const r=engagedFist().update([fist(.92)],160);assert.equal(r.mode,'zoom');assert.ok(r.zoom>1);});
test('lateral fist movement does not zoom or rotate',()=>{const r=engagedFist().update([fist(1,.54,.54)],160);assert.equal(r.zoom,1);assert.equal(r.x,0);assert.equal(r.y,0);});
test('open hand stops fist zoom and new gesture has no jump',()=>{const g=engagedFist();const r=g.update([hand(.5,.5,.9)],160);assert.equal(r.zoom,1);assert.equal(g.update([fist(1.2)],200).zoom,1);});
test('two active hands pause rather than switch to two-pinch zoom',()=>{const r=engaged().update([hand(.3),hand(.7)],120);assert.equal(r.mode,'paused');assert.equal(r.zoom,1);});
test('sudden fist scale jump is rejected',()=>{const r=engagedFist().update([fist(1.6)],160);assert.equal(r.zoom,1);assert.equal(r.mode,'arming');});
test('fist zoom engages within 60ms and gives a strong first response',()=>{
 const g=new HandGestures();g.update([fist()],0);g.update([fist()],33);
 const r=g.update([fist(1.08)],66);assert.equal(r.mode,'zoom');assert.ok(r.zoom<.83,'8% depth movement should change distance by at least 17%');
});
test('fist tremor stays still at mobile and desktop frame rates',()=>{
 for(const dt of [16,33,66]){const g=engagedFist();for(let i=1;i<30;i++){const r=g.update([fist(i%2?1.005:.995)],120+i*dt);assert.equal(r.zoom,1);}}
});
test('fist zoom reverses on the next frame without a smoothing tail',()=>{
 const g=engagedFist();assert.ok(g.update([fist(1.08)],153).zoom<1);assert.ok(g.update([fist(1)],186).zoom>1);
});
test('fast mobile fist movement stays bounded at low frame rates',()=>{
 const g=engagedFist();const r=g.update([fist(.82)],200);assert.equal(r.mode,'zoom');assert.ok(r.zoom>1.2);assert.ok(r.zoom<=Math.exp(.35));
});
