import { Quaternion, Vector3 } from 'three';
/** Rotate around the current view axes, including over both poles. */
export function rotateView(position:Vector3,up:Vector3,target:Vector3,x:number,y:number){
 const offset=position.clone().sub(target);
 const turn=new Quaternion().setFromAxisAngle(up.clone().normalize(),x);
 offset.applyQuaternion(turn);
 const right=new Vector3().crossVectors(up,offset).normalize();
 const tilt=new Quaternion().setFromAxisAngle(right,y);
 offset.applyQuaternion(tilt);up.applyQuaternion(tilt).normalize();
 position.copy(target).add(offset);
}
