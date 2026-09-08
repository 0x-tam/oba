import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
let tracker:HandLandmarker|null=null;
self.onmessage=async(event:MessageEvent)=>{
 const message=event.data;
 try{
  if(message.type==='init'){
   const files=await FilesetResolver.forVisionTasks(`${message.origin}/hand-tracking/wasm`,true);
   tracker=await HandLandmarker.createFromOptions(files,{
    baseOptions:{modelAssetPath:`${message.origin}/hand-tracking/hand_landmarker.task`,delegate:'CPU'},
    runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.65,minHandPresenceConfidence:.65,minTrackingConfidence:.65,
   });
   self.postMessage({type:'ready'});
  }else if(message.type==='frame'){
   try{
    const result=tracker!.detectForVideo(message.bitmap,message.time);
    self.postMessage({type:'result',time:message.time,hands:result.landmarks});
   }finally{message.bitmap.close();}
  }
 }catch{self.postMessage({type:'error'});}
};
