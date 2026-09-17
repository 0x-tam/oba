const base='/hand-tracking';
export function trackingPreloadUrls(compressed:boolean){
 return [
  `${base}/hand_landmarker.task${compressed?'.gz':''}`,
  `${base}/wasm/vision_wasm_module_internal.wasm${compressed?'.gz':''}`,
  `${base}/wasm/vision_wasm_module_internal.js`,
 ];
}
let pending:Promise<void>|undefined;
/** Warm only HTTP cache; never request the camera or initialize detection. */
export function preloadHandTracking(fetcher:typeof fetch=fetch){
 return pending??=Promise.allSettled(trackingPreloadUrls(typeof DecompressionStream!=='undefined').map(async url=>{
  const response=await fetcher(url,{cache:'force-cache',priority:'low',keepalive:true});
  if(response.ok)await response.arrayBuffer();
 })).then(()=>undefined);
}
