import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {rotateView} from '../lib/model-rotation.ts';
test('full vertical rotation returns to the same view from top, front and arbitrary positions',()=>{
 for(const origin of [new Vector3(0,10,.01),new Vector3(0,0,10),new Vector3(3,5,8)]){
  const target=new Vector3(4,-2,1),position=origin.clone().add(target),up=new Vector3(0,1,0),start=position.clone();
  for(let i=0;i<16;i++)rotateView(position,up,target,0,Math.PI/8);
  assert.ok(position.distanceTo(start)<1e-9);assert.ok(Math.abs(up.length()-1)<1e-9);
 }
});
test('mixed rotations preserve distance and finite camera axes after repeated pole crossings',()=>{
 const target=new Vector3(3,4,5),p=new Vector3(8,9,11),up=new Vector3(0,1,0),distance=p.distanceTo(target);
 for(let i=0;i<2000;i++)rotateView(p,up,target,.07,.11);
 assert.ok(Math.abs(p.distanceTo(target)-distance)<1e-9);assert.ok(Number.isFinite(up.x+up.y+up.z));
});
