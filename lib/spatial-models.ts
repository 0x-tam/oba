import * as THREE from 'three';
export type StudyModel={root:THREE.Group;setExplode:(n:number)=>void;setRoof:(visible:boolean)=>void};
function material(color:string){return new THREE.MeshStandardMaterial({color,roughness:.78,metalness:.04})}
function box(group:THREE.Group,size:number[],pos:number[],mat:THREE.Material){const m=new THREE.Mesh(new THREE.BoxGeometry(...size as [number,number,number]),mat);m.position.set(...pos as [number,number,number]);m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function beam(group:THREE.Group,a:THREE.Vector3,b:THREE.Vector3,w:number,d:number,mat:THREE.Material){const m=box(group,[w,a.distanceTo(b),d],a.clone().add(b).multiplyScalar(.5).toArray(),mat);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return m}
export function createBenina(field:boolean):StudyModel{
 const root=new THREE.Group();const steel=material('#aeb6ae');const concrete=material('#eeede3');const columns=new THREE.Group(),arches=new THREE.Group(),roof=new THREE.Group(),glazing=new THREE.Group(),beams=new THREE.Group();root.add(columns,arches,beams,roof,glazing);
 const nx=field?3:1,nz=field?2:1,B=4,H=4,ox=-nx*B/2,oz=-nz*B/2;
 for(let x=0;x<=nx;x++)for(let z=0;z<=nz;z++)box(columns,[.13,2.15,.13],[ox+x*B,1.075,oz+z*B],steel);
 function arch(x:number,z:number,rot:number){const shape=new THREE.Shape();shape.moveTo(0,3.68);shape.lineTo(B,3.68);shape.lineTo(B,2.0);for(let j=0;j<=40;j++){const t=Math.PI*j/40;shape.lineTo(B/2+B/2*Math.cos(t),2+1.55*Math.sin(t))}shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:false});const mesh=new THREE.Mesh(geo,steel);mesh.position.set(x,0,z);mesh.rotation.y=rot;mesh.castShadow=true;arches.add(mesh)}
 for(let x=0;x<nx;x++)for(let z=0;z<=nz;z++){arch(ox+x*B,oz+z*B,0);box(beams,[B,.18,.15],[ox+(x+.5)*B,3.8,oz+z*B],steel)}
 for(let x=0;x<=nx;x++)for(let z=0;z<nz;z++){arch(ox+x*B,oz+z*B,-Math.PI/2);box(beams,[.15,.18,B],[ox+x*B,3.8,oz+(z+.5)*B],steel)}
 for(let x=0;x<nx;x++)for(let z=0;z<nz;z++){
  const s=new THREE.Shape();s.moveTo(-1.94,-1.94);s.lineTo(1.94,-1.94);s.lineTo(1.94,1.94);s.lineTo(-1.94,1.94);s.closePath();const hole=new THREE.Path();hole.absarc(0,0,.46,0,Math.PI*2,true);s.holes.push(hole);
  const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.31,bevelEnabled:false,curveSegments:40}),concrete);m.rotation.x=-Math.PI/2;m.position.set(ox+(x+.5)*B,3.84,oz+(z+.5)*B);m.castShadow=true;m.receiveShadow=true;roof.add(m);
  const g=new THREE.Mesh(new THREE.CircleGeometry(.44,48),new THREE.MeshPhysicalMaterial({color:'#b6d1d1',roughness:.1,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false}));g.rotation.x=-Math.PI/2;g.position.set(m.position.x,4.18,m.position.z);glazing.add(g);
 }
 return{root,setExplode(n){arches.position.y=n*.85;beams.position.y=n*1.6;roof.position.y=n*2.8;glazing.position.y=n*3.4},setRoof(v){roof.visible=v;glazing.visible=v}};
}
export function createThing():StudyModel{
 const root=new THREE.Group();root.scale.setScalar(3.7);root.position.set(-1.85,.05,-1.85);const wood=['#b98d59','#c29a68','#cfa976','#d5b382','#c4a273'].map(material);const dark=material('#2e3230');const spine=new THREE.Group(),top=new THREE.Group(),bottom=new THREE.Group(),shelf=new THREE.Group(),rod=new THREE.Group();root.add(spine,top,bottom,shelf,rod);
 for(let i=0;i<11;i++)box(spine,[.056,1,.036],[.032+i*.093,0.5,0],wood[i%wood.length]);
 box(spine,[1.04,.038,.06],[.5,0,0],wood[2]);box(spine,[1.04,.038,.06],[.5,1,0],wood[1]);
 function triangle(g:THREE.Group,y:number){for(let i=0;i<11;i++){const x=.025+i*.09;const l=1-x;box(g,[.054,.035,l],[x,y,l/2],wood[(i+2)%wood.length])}beam(g,new THREE.Vector3(0,y,0),new THREE.Vector3(0,y,1),.037,.043,wood[0]);beam(g,new THREE.Vector3(0,y,1),new THREE.Vector3(1,y,0),.037,.043,wood[2]);beam(g,new THREE.Vector3(0,y,0),new THREE.Vector3(1,y,0),.037,.043,wood[1])}
 triangle(top,1);triangle(bottom,0);
 const shape=new THREE.Shape();shape.moveTo(.03,.03);shape.lineTo(.89,.03);shape.lineTo(.03,.89);shape.closePath();const plane=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.015,bevelEnabled:false}),dark);plane.rotation.x=Math.PI/2;plane.position.y=.47;shelf.add(plane);
 const leg=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,1,12),dark);leg.position.set(.025,.5,.965);rod.add(leg);
 for(const pos of [[.02,1,.98],[.98,1,.02],[.02,0,.98]]){const bolt=new THREE.Mesh(new THREE.SphereGeometry(.012,10,8),dark);bolt.position.set(...pos as [number,number,number]);root.add(bolt)}
 return{root,setExplode(n){top.position.y=n*.5;bottom.position.y=-n*.05;spine.position.z=-n*.35;rod.position.x=-n*.25;rod.position.z=n*.25;shelf.position.x=n*.45;shelf.position.z=n*.45},setRoof(v){top.visible=v}};
}
export function disposeObject(root:THREE.Object3D){const mats=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m))}});mats.forEach(m=>m.dispose())}
