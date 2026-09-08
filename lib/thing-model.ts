import * as THREE from 'three';
import type { StudyModel, StudyPart } from './spatial-models';

// Proportions traced from the 2021 Flatpack photographs; not fabrication dimensions.
export function createThing():StudyModel {
 const root=new THREE.Group();root.scale.setScalar(3.7);root.position.set(-1.85,.06,-1.65);
 const W=1,H=1.04,D=.9,T=.032;
 const grainData=new Uint8Array(64*256*4);
 for(let y=0;y<256;y++)for(let x=0;x<64;x++){
  const wave=Math.sin(x*.68+Math.sin(y*.035)*.7)*5+Math.sin(x*2.8+y*.008)*2;
  const v=237+wave,i=(y*64+x)*4;grainData[i]=v;grainData[i+1]=v;grainData[i+2]=v;grainData[i+3]=255;
 }
 const grain=new THREE.DataTexture(grainData,64,256);grain.needsUpdate=true;grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
 const woods=['#cda66f','#dbb783','#bb925d','#d4ad74','#c69d67'].map(color=>new THREE.MeshStandardMaterial({color,map:grain,roughness:.61}));
 const black=new THREE.MeshStandardMaterial({color:'#242323',roughness:.6,metalness:.25});
 const metal=new THREE.MeshStandardMaterial({color:'#4b463d',roughness:.4,metalness:.7});
 const spine=new THREE.Group(),top=new THREE.Group(),bottom=new THREE.Group(),shelf=new THREE.Group(),rod=new THREE.Group(),joints=new THREE.Group();
 root.add(spine,top,bottom,shelf,rod,joints);top.position.y=H;bottom.position.y=0;
 function mesh(g:THREE.Group,geo:THREE.BufferGeometry,mat:THREE.Material,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
 function board(g:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material){
  const s=new THREE.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2);s.lineTo(-w/2,h/2);s.closePath();
  const geo=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.0015,bevelThickness:.0015});geo.translate(0,0,-d/2);return mesh(g,geo,mat,x,y,z);
 }
 function strip(g:THREE.Group,x0:number,x1:number,z0:number,z1a:number,z1b:number,mat:THREE.Material){
  const s=new THREE.Shape();s.moveTo(x0,z0);s.lineTo(x1,z0);s.lineTo(x1,z1b);s.lineTo(x0,z1a);s.closePath();
  const geo=new THREE.ExtrudeGeometry(s,{depth:T,bevelEnabled:true,bevelSegments:1,bevelSize:.0012,bevelThickness:.0012});
  const m=mesh(g,geo,mat);m.rotation.x=Math.PI/2;return m;
 }
 function screw(g:THREE.Group,x:number,y:number,z:number,rotation=0){
  const m=mesh(g,new THREE.CylinderGeometry(.009,.007,.004,16),metal,x,y,z);m.rotation.z=rotation;
  const slot=mesh(g,new THREE.BoxGeometry(.009,.001,.0018),black,x,y+.0025,z);slot.rotation.z=rotation;
 }
 // Continuous rectangular spine, with inset crosspieces visible through the open slats.
 for(let i=0;i<10;i++)board(spine,.055,H,T,.031+i*.104,H/2,0,woods[i%5]);
 for(const y of [.05,H-.05])board(spine,W,.038,.025,W/2,y,-.027,woods[2]);
 // Small centerline joints and end blocks are visible in the source close-ups.
 for(let i=0;i<10;i++){const x=.031+i*.104;board(spine,.055,.002,.003,x,H*.48,-T/2-.002,black);}
 function triangle(g:THREE.Group){
  for(let i=0;i<10;i++){
   const x0=.006+i*.104,x1=Math.min(x0+.055,W-.005);
   const zA=D*(1-x0/W),zB=D*(1-x1/W);
   if(zB>.045)strip(g,x0,x1,0,zA-.025,zB-.025,woods[(i+1)%5]);
  }
  // Diagonal edge rail is a mitered trapezoid, not a rectangular outline over the slats.
  const s=new THREE.Shape();s.moveTo(0,D);s.lineTo(W,0);s.lineTo(W-.068,0);s.lineTo(0,D-.061);s.closePath();
  const edge=mesh(g,new THREE.ExtrudeGeometry(s,{depth:T,bevelEnabled:true,bevelSize:.0015,bevelThickness:.0015,bevelSegments:1}),woods[1]);edge.rotation.x=Math.PI/2;
  board(g,.038,T,D-.05,.019,-T/2,(D-.05)/2,woods[3]);
  for(const x of [.045,.93])screw(g,x,.003,D*(1-x/W)-.021);
 }
 triangle(top);triangle(bottom);
 // Dark removable shelf stays within the triangular footprint.
 const shelfShape=new THREE.Shape();shelfShape.moveTo(.042,.025);shelfShape.lineTo(.91,.025);shelfShape.lineTo(.042,.82);shelfShape.closePath();
 const shelfMesh=mesh(shelf,new THREE.ExtrudeGeometry(shelfShape,{depth:.012,bevelEnabled:true,bevelSegments:1,bevelSize:.002,bevelThickness:.001}),black,0,H*.48,0);shelfMesh.rotation.x=Math.PI/2;
 board(shelf,.045,.025,.78,.042,H*.48-.023,.415,woods[2]);
 mesh(rod,new THREE.CylinderGeometry(.012,.012,H+.055,24),black,.025,H/2,.866);
 mesh(rod,new THREE.CylinderGeometry(.016,.016,.026,20),black,.025,.006,.866);
 mesh(rod,new THREE.CylinderGeometry(.018,.018,.012,20),metal,.025,H*.48-.013,.866);
 // Compact dark hinge barrels between the folding panels and the spine.
 for(const y of [.012,H-.02])for(const x of [.16,.47,.78]){
  const hinge=mesh(joints,new THREE.CylinderGeometry(.009,.009,.045,16),metal,x,y,.007);hinge.rotation.z=Math.PI/2;
  board(joints,.047,.022,.005,x,y,.021,metal);
 }
 let exploded=0,angle=0;
 function layout(){
  const rad=THREE.MathUtils.degToRad(angle);
  top.position.set(0,H+exploded*.28,0);top.rotation.x=-rad;
  bottom.position.set(0,-exploded*.12,0);bottom.rotation.x=rad;
  spine.position.z=-exploded*.2;joints.position.z=-exploded*.2;
  shelf.position.set(exploded*.2,0,exploded*.5+angle/90*.65);
  rod.position.set(exploded*.35+angle/90*.3,0,exploded*.3+angle/90*.35);
 }
 const part=(id:string,label:string,detail:string,node:THREE.Object3D):StudyPart=>{node.userData.partId=id;return{id,label,detail,node};};
 return {root,parts:[
  part('spine','Slatted timber spine','Individual solid-wood strips and inset crosspieces form the rectangular back panel. Timber tones follow the mixed offcuts visible in the photographs.',spine),
  part('top','Folding triangular top','Mitered strips finish against a continuous diagonal edge. The top folds outward along its connection to the back panel.',top),
  part('bottom','Folding lower panel','The matching lower triangle opens in the opposite direction to flatten the timber assembly.',bottom),
  part('shelf','Removable black shelf','A thin triangular insert sits at the centerline, inside the open timber frame.',shelf),
  part('rod','Detachable corner rod','The slender dark support stands at the free corner; it is removed for packing.',rod),
  part('joints','Folding connections','Small dark connectors are visible in the packing photographs. The internal fastener geometry remains approximate.',joints),
 ],setExplode(n){exploded=n;layout();},setRoof(v){top.visible=v;},setDetail(n){angle=n;layout();}};
}
