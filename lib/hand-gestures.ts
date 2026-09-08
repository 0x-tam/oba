export type Point = { x: number; y: number };
export type Hand = Point[];
export type GestureMode = 'searching' | 'paused' | 'ready' | 'arming' | 'rotate' | 'zoom';
type Track = { id: number; point: Point; pinch: boolean };
const distance = (a: Point, b: Point) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (n:number, limit:number) => Math.max(-limit,Math.min(limit,n));

/** A release is a clutch: reacquisition and mode changes always establish a new baseline. */
export class HandGestures {
 private tracks:Track[]=[];
 private nextId=0;
 private signature='';
 private since=0;
 private time=-1;
 private baseline:Point|null=null;
 private span=0;
 private releaseRequired=false;
 reset(){this.tracks=[];this.signature='';this.baseline=null;this.span=0;this.time=-1;this.releaseRequired=false;}
 update(hands:Hand[], now:number){
  const result={mode:'searching' as GestureMode,x:0,y:0,zoom:1,points:[] as Array<Point & {pinch:boolean}>};
  if(!Number.isFinite(now)||now<=this.time)return result;
  const dt=this.time<0?33:now-this.time;
  if(dt>180)this.reset();
  this.time=now;
  const available=[...this.tracks];
  this.tracks=hands.slice(0,2).filter(h=>h.length>=21&&h.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))).map(h=>{
   const point={x:(h[4].x+h[8].x)/2,y:(h[4].y+h[8].y)/2};
   const palm=distance(h[0],h[9]);
   available.sort((a,b)=>distance(a.point,point)-distance(b.point,point));
   const previous=available[0]&&distance(available[0].point,point)<.16?available.shift():undefined;
   const pinch=palm>.035&&distance(h[4],h[8])/palm<(previous?.pinch? .58:.38);
   return {id:previous?.id??this.nextId++,point,pinch};
  });
  result.points=this.tracks.map(t=>({...t.point,pinch:t.pinch}));
  const active=this.tracks.filter(t=>t.pinch).sort((a,b)=>a.id-b.id);
  const signature=active.map(t=>t.id).join(',');
  if(this.signature.includes(',')&&active.length===1)this.releaseRequired=true;
  if(this.releaseRequired&&active.length){result.mode='paused';this.signature='';this.baseline=null;return result;}
  if(!active.length){this.releaseRequired=false;this.signature='';this.baseline=null;this.span=0;result.mode=this.tracks.length?'ready':'searching';return result;}
  const point=active[0].point;
  const span=active.length===2?distance(point,active[1].point):0;
  if(signature!==this.signature){this.signature=signature;this.since=now;this.baseline=point;this.span=span;result.mode='arming';return result;}
  if(now-this.since<70){this.baseline=point;this.span=span;result.mode='arming';return result;}
  result.mode=active.length===2?'zoom':'rotate';
  // Adapt to motion: suppress stationary tremor without the long tail of fixed smoothing.
  if(result.mode==='rotate'&&this.baseline){
   const dx=point.x-this.baseline.x,dy=point.y-this.baseline.y;
   if(Math.hypot(dx,dy)>.12){this.baseline=point;result.mode='arming';this.since=now;return result;}
   const alpha=1-Math.exp(-Math.min(dt,80)/(Math.hypot(dx,dy)>.012?18:40));
   if(Math.abs(dx)>.002){result.x=clamp(-dx*alpha*5,.14);this.baseline.x+=dx*alpha;}
   if(Math.abs(dy)>.002){result.y=clamp(dy*alpha*3,.09);this.baseline.y+=dy*alpha;}
  }else if(result.mode==='zoom'){
   if(span>.09&&this.span>.09){const delta=Math.log(this.span/span);if(Math.abs(delta)>.012)result.zoom=Math.exp(clamp(delta,.07));}
   this.span=span;
  }
  return result;
 }
}
