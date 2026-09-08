import * as THREE from 'three';
export type StudyPart={id:string;label:string;detail:string;node:THREE.Object3D};
export type StudyModel={root:THREE.Group;parts:StudyPart[];setExplode:(n:number)=>void;setRoof:(visible:boolean)=>void;setDetail?:(n:number)=>void};
function part(id:string,label:string,detail:string,node:THREE.Object3D):StudyPart{node.userData.partId=id;return{id,label,detail,node}}
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
 return{root,parts:[part('columns','Corner columns','Slender columns sit at the corners of each bay, keeping its centre open.',columns),part('arches','Arch supports','Curved steel supports meet between columns to form arches in both directions.',arches),part('beams','Perimeter beams','Horizontal members link the repeated structural units.',beams),part('roof','Precast roof slabs','A circular opening is cut through each square roof module.',roof),part('glazing','Skylights','Roof openings bring diffuse light into the terminal.',glazing)],setExplode(n){arches.position.y=n*.85;beams.position.y=n*1.6;roof.position.y=n*2.8;glazing.position.y=n*3.4},setRoof(v){roof.visible=v;glazing.visible=v}};
}
export {createThing} from './thing-model';
export function disposeObject(root:THREE.Object3D){const mats=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m))}});const textures=new Set<THREE.Texture>();mats.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial&&m.map)textures.add(m.map);m.dispose()});textures.forEach(t=>t.dispose())}
