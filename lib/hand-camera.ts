import TrackingWorker from '../workers/hand-tracking.worker?worker';
import { HandGestures, type Hand, type GestureMode } from './hand-gestures';
export type GestureFrame=ReturnType<HandGestures['update']> & {hands:Hand[]};
export const gestureHints:Record<GestureMode,string>={
 paused:'Use one hand at a time · Open the other hand',
 searching:'Show your hands · Keep fingertips in view',ready:'Ready · Pinch to rotate, make a fist to zoom',
 arming:'Hold your gesture…',rotate:'Rotate · Move your pinched hand',zoom:'Zoom · Pull your fist toward the camera to zoom in; push away to zoom out',
};
/** One frame in flight. Slow devices drop frames instead of accumulating delayed movement. */
export function trackCamera(video:HTMLVideoElement, callbacks:{ready:()=>void;progress?:(message:string)=>void;frame:(frame:GestureFrame)=>void;error:(message:string)=>void}){
 let worker:Worker;let attempts=0;
 const gestures=new HandGestures();
 let stopped=false,busy=false,ready=false,raf=0,lastVideo=-1;
 let timer:ReturnType<typeof setTimeout>;
 const startupTimer=setTimeout(()=>{if(!stopped&&!ready){stop();callbacks.error('Hand tracking could not finish downloading. Check your connection and try again.')}},120000);
 const fail=(message='Hand tracking could not start. Reload this page and try again.')=>{if(stopped)return;if(!ready&&attempts<2){worker.terminate();callbacks.progress?.('Retrying hand tracking…');start();return;}stop();callbacks.error(message);};
 function stop(){stopped=true;clearTimeout(startupTimer);clearTimeout(timer);cancelAnimationFrame(raf);worker.terminate();gestures.reset();}
 function deadline(ms:number){clearTimeout(timer);timer=setTimeout(()=>fail(ready?'Hand tracking stopped responding. Try enabling it again.':'Hand tracking took too long to load. Check your connection and try again.'),ms);}
 function start(){attempts++;worker=new TrackingWorker();const activeWorker=worker;
 worker.onerror=()=>{if(activeWorker===worker)fail()};
 worker.onmessageerror=()=>{if(activeWorker===worker)fail()};
 worker.onmessage=event=>{
  if(activeWorker!==worker)return;
  if(stopped)return;
  if(event.data.type==='error'){fail('Hand tracking could not load. Reload the page and try again.');return;}
  if(event.data.type==='progress'&&!ready){deadline(45000);callbacks.progress?.(event.data.message);}
  if(event.data.type==='ready'){ready=true;clearTimeout(startupTimer);clearTimeout(timer);callbacks.ready();}
  if(event.data.type==='result'){
   busy=false;clearTimeout(timer);
   if(performance.now()-event.data.time>180){gestures.reset();callbacks.frame({...gestures.update([],performance.now()),hands:[]});}
   else callbacks.frame({...gestures.update(event.data.hands,event.data.time),hands:event.data.hands});
  }
 };
 deadline(45000);worker.postMessage({type:'init',origin:location.origin});
 }
 // The tracking video is offscreen; use RAF so compositor visibility cannot stall tracking.
 function schedule(){if(!stopped)raf=requestAnimationFrame(loop);}
 async function loop(now:number){
  if(stopped)return;
  schedule();
  if(!ready||busy||video.readyState<2||video.currentTime===lastVideo)return;
  busy=true;lastVideo=video.currentTime;deadline(6000);
  try{
   const bitmap=await createImageBitmap(video);
   if(stopped){bitmap.close();return;}
   worker.postMessage({type:'frame',bitmap,time:now},[bitmap]);
  }catch{fail('The camera frame could not be read. Turn hand control off and try again.');}
 }
 start();schedule();
 return stop;
}
