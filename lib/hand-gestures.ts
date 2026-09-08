export type Point = { x: number; y: number };
export type Hand = Point[];
export type GestureMode = 'searching' | 'paused' | 'ready' | 'arming' | 'rotate' | 'zoom';
type Track = { id:number; point:Point; pinch:boolean; fist:boolean; scale:number; shape:number };
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(n:number,limit:number)=>Math.max(-limit,Math.min(limit,n));

/** A fist controls depth from apparent palm size; release and tracking gaps reset the baseline. */
export class HandGestures {
 private tracks:Track[]=[];private nextId=0;private signature='';private since=0;private time=-1;
 private baseline:Point|null=null;private scale=0;private shape=0;
 reset(){this.tracks=[];this.signature='';this.baseline=null;this.scale=0;this.time=-1;}
 update(hands:Hand[],now:number){
  const result={mode:'searching' as GestureMode,x:0,y:0,zoom:1,points:[] as Array<Point & {pinch:boolean;fist:boolean}>};
  if(!Number.isFinite(now)||now<=this.time)return result;
  const dt=this.time<0?33:now-this.time;if(dt>180)this.reset();this.time=now;
  const available=[...this.tracks];
  this.tracks=hands.slice(0,2).filter(h=>h.length>=21&&h.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))).map(h=>{
   const palm=distance(h[0],h[9]),width=distance(h[5],h[17]);
   const center={x:(h[0].x+h[5].x+h[9].x+h[17].x)/4,y:(h[0].y+h[5].y+h[9].y+h[17].y)/4};
   available.sort((a,b)=>distance(a.point,center)-distance(b.point,center));
   const previous=available[0]&&distance(available[0].point,center)<.18?available.shift():undefined;
   const curl=[8,12,16,20].filter(tip=>distance(h[tip],h[0])<distance(h[tip-2],h[0])*(previous?.fist?1.12:.97)&&distance(h[tip],h[tip-3])<palm*(previous?.fist? .85:.7)).length;
   const fist=palm>.035&&width>.025&&curl===4;
   const pinch=!fist&&palm>.035&&distance(h[4],h[8])/palm<(previous?.pinch? .58:.38);
   return {id:previous?.id??this.nextId++,point:center,pinch,fist,scale:Math.sqrt(palm*width),shape:width/Math.max(palm,.001)};
  });
  result.points=this.tracks.map(t=>({...t.point,pinch:t.pinch,fist:t.fist}));
  const active=this.tracks.filter(t=>t.pinch||t.fist);
  if(active.length!==1){this.signature='';this.baseline=null;this.scale=0;result.mode=active.length>1?'paused':this.tracks.length?'ready':'searching';return result;}
  const hand=active[0],mode=hand.fist?'zoom':'rotate',signature=hand.id+':'+mode;
  if(signature!==this.signature){this.signature=signature;this.since=now;this.baseline={...hand.point};this.scale=hand.scale;this.shape=hand.shape;result.mode='arming';return result;}
  if(now-this.since<(hand.fist?60:70)){this.baseline={...hand.point};this.scale=hand.scale;this.shape=hand.shape;result.mode='arming';return result;}
  result.mode=mode;
  if(mode==='rotate'&&this.baseline){
   const dx=hand.point.x-this.baseline.x,dy=hand.point.y-this.baseline.y;
   if(Math.hypot(dx,dy)>.12){this.baseline={...hand.point};this.since=now;result.mode='arming';return result;}
   const alpha=1-Math.exp(-Math.min(dt,80)/(Math.hypot(dx,dy)>.012?18:40));
   if(Math.abs(dx)>.002){result.x=clamp(-dx*alpha*5,.14);this.baseline.x+=dx*alpha;}
   if(Math.abs(dy)>.002){result.y=clamp(dy*alpha*3,.09);this.baseline.y+=dy*alpha;}
  }else if(mode==='zoom'){
   // Palm landmarks remain stable while fingers curl. Reject wrist turns and scale jumps.
   const delta=Math.log(this.scale/hand.scale),turn=Math.abs(Math.log(hand.shape/this.shape));
   if(turn>.16||Math.abs(delta)>.25){this.scale=hand.scale;this.shape=hand.shape;this.since=now;result.mode='arming';return result;}
   if(Math.abs(delta)>.018){const filtered=delta*(1-Math.exp(-Math.min(dt,80)/12));const stepLimit=Math.min(.35,Math.max(.12,.22*dt/33));result.zoom=Math.exp(clamp(filtered*3.6,stepLimit));this.scale*=Math.exp(-filtered);}
   this.shape=hand.shape;
  }
  return result;
 }
}
