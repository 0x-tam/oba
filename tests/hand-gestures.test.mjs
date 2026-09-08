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
test('two pinches zoom, ordering does not change the gesture',()=>{const g=new HandGestures();g.update([hand(.3),hand(.7)],0);g.update([hand(.3),hand(.7)],80);const r=g.update([hand(.72),hand(.28)],120);assert.equal(r.mode,'zoom');assert.ok(r.zoom<1);assert.equal(r.x,0);});
test('a second open hand cannot accidentally zoom',()=>{const g=engaged();const r=g.update([hand(.42),hand(.75,.4,.9)],120);assert.equal(r.mode,'rotate');assert.equal(r.zoom,1);});
test('losing one hand while zooming requires release before rotation',()=>{const g=new HandGestures();g.update([hand(.3),hand(.7)],0);g.update([hand(.3),hand(.7)],80);for(const t of [120,160,200])assert.equal(g.update([hand(.32)],t).x,0);g.update([hand(.32,.4,.9)],240);assert.equal(g.update([hand(.32)],280).mode,'arming');});
test('invalid landmarks are ignored',()=>{const g=engaged();assert.equal(g.update([[{x:NaN,y:0}]],120).mode,'searching');});
