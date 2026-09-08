import TrackingWorker from '../workers/hand-tracking.worker?worker';
import { HandGestures, type Hand, type GestureMode } from './hand-gestures';
export type GestureFrame=ReturnType<HandGestures['update']> & {hands:Hand[]};
export const gestureHints:Record<GestureMode,string>={
 paused:'Use one hand at a time · Open the other hand',
 searching:'Show your hands · Keep fingertips in view',ready:'Ready · Pinch to rotate, make a fist to zoom',
 arming:'Hold your gesture…',rotate:'Rotate · Move your pinched hand',zoom:'Zoom · Pull your fist toward the camera to zoom in; push away to zoom out',
};
/** One frame in flight. Slow devices drop frames instead of accumulating delayed movement. */
export function trackCamera(video:HTMLVideoElement, callbacks:{ready:()=>void;frame:(frame:GestureFrame)=>void;error:()=>void}){
 const worker=new TrackingWorker();
 const gestures=new HandGestures();
 let stopped=false,busy=false,ready=false,raf=0,lastVideo=-1,lastSent=0;
 let timer:ReturnType<typeof setTimeout>;
 const fail=()=>{if(stopped)return;stop();callbacks.error();};
 function stop(){stopped=true;clearTimeout(timer);cancelAnimationFrame(raf);worker.terminate();gestures.reset();}
 function deadline(ms:number){clearTimeout(timer);timer=setTimeout(fail,ms);}
 worker.onerror=fail;
 worker.onmessage=event=>{
  if(stopped)return;
  if(event.data.type==='error'){fail();return;}
  if(event.data.type==='ready'){ready=true;clearTimeout(timer);callbacks.ready();}
  if(event.data.type==='result'){
   busy=false;clearTimeout(timer);
   if(performance.now()-event.data.time>180){gestures.reset();callbacks.frame({...gestures.update([],performance.now()),hands:[]});}
   else callbacks.frame({...gestures.update(event.data.hands,event.data.time),hands:event.data.hands});
  }
 };
 async function loop(now:number){
  if(stopped)return;
  raf=requestAnimationFrame(loop);
  if(!ready||busy||video.readyState<2||video.currentTime===lastVideo||now-lastSent<32)return;
  busy=true;lastVideo=video.currentTime;lastSent=now;deadline(6000);
  try{
   const bitmap=await createImageBitmap(video);
   if(stopped){bitmap.close();return;}
   worker.postMessage({type:'frame',bitmap,time:now},[bitmap]);
  }catch{fail();}
 }
 deadline(45000);worker.postMessage({type:'init',origin:location.origin});raf=requestAnimationFrame(loop);
 return stop;
}
