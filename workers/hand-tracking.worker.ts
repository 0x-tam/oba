import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
let tracker:HandLandmarker|null=null;
const progress=(message:string)=>self.postMessage({type:'progress',message});
async function loadAsset(url:string,label:string){
 const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;
 const arm=()=>{clearTimeout(timer);timer=setTimeout(()=>controller.abort(),20000)};
 arm();
 try{
  const response=await fetch(url,{signal:controller.signal,cache:'force-cache'});
  if(!response.ok)throw new Error(`Tracking file download failed (${response.status}).`);
  const reader=response.body?.getReader();if(!reader)return new Uint8Array(await response.arrayBuffer());
  const chunks:Uint8Array[]=[];let received=0,lastPercent=-1;const total=Number(response.headers.get('content-length'));
  while(true){const {done,value}=await reader.read();if(done)break;arm();chunks.push(value);received+=value.length;const percent=total?Math.min(100,Math.floor(received/total*100)):0;if(percent!==lastPercent){progress(total?`Downloading ${label} · ${percent}%`:`Downloading ${label}…`);lastPercent=percent;}}
  const bytes=new Uint8Array(received);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
 }finally{clearTimeout(timer!)}
}
self.onmessage=async(event:MessageEvent)=>{
 const message=event.data;
 try{
  if(message.type==='init'){
   progress('Loading hand tracking…');
   const files=await FilesetResolver.forVisionTasks(`${message.origin}/hand-tracking/wasm`,true);
   const runtime=async()=>{
    const compressed=typeof DecompressionStream!=='undefined';
    const bytes=await loadAsset(files.wasmBinaryPath+(compressed?'.gz':''),'tracking engine');
    const blob=new Blob([bytes.buffer as ArrayBuffer]);
    const decoded=compressed&&bytes[0]===31&&bytes[1]===139?await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():bytes.buffer;
    return URL.createObjectURL(new Blob([decoded as ArrayBuffer],{type:'application/wasm'}));
   };
   const [runtimeUrl,modelAssetBuffer]=await Promise.all([runtime(),loadAsset(`${message.origin}/hand-tracking/hand_landmarker.task`,'hand model')]);
   progress('Starting hand detector…');
   try{
    tracker=await HandLandmarker.createFromOptions({...files,wasmBinaryPath:runtimeUrl},{
     baseOptions:{modelAssetBuffer,delegate:'CPU'},
     runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.65,minHandPresenceConfidence:.65,minTrackingConfidence:.65,
    });
   }finally{URL.revokeObjectURL(runtimeUrl);}
   self.postMessage({type:'ready'});
  }else if(message.type==='frame'){
   try{
    const result=tracker!.detectForVideo(message.bitmap,message.time);
    self.postMessage({type:'result',time:message.time,hands:result.landmarks});
   }finally{message.bitmap.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:'Hand detector could not start.'});}
};
