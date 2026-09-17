import {test} from 'node:test';
import assert from 'node:assert/strict';
import {preloadHandTracking,trackingPreloadUrls} from '../lib/tracking-preload.ts';
test('background preload fetches compressed files once and consumes responses into cache',async()=>{
 const calls=[];let consumed=0;
 const fetcher=async(url,options)=>{calls.push({url,options});return{ok:true,arrayBuffer:async()=>{consumed++;return new ArrayBuffer(0)}}};
 await Promise.all([preloadHandTracking(fetcher),preloadHandTracking(fetcher)]);
 assert.equal(calls.length,3);assert.equal(consumed,3);
 assert.deepEqual(calls.map(c=>c.url),trackingPreloadUrls(true));
 for(const {options} of calls){assert.equal(options.priority,'low');assert.equal(options.cache,'force-cache');assert.equal(options.keepalive,true);}
});
test('older browsers preload the matching uncompressed fallback',()=>{
 const urls=trackingPreloadUrls(false);assert.ok(urls.includes('/hand-tracking/hand_landmarker.task'));assert.ok(urls.every(url=>!url.endsWith('.gz')));
});
