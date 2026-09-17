import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const source=readFileSync('workers/hand-tracking.worker.ts','utf8').replace(/^import .*\n/,'');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
function runtime(fetch){const messages=[];let options;const self={postMessage:m=>messages.push(m)};
 vm.runInNewContext(code,{self,fetch,AbortController,Uint8Array,setTimeout,clearTimeout,Error,Blob,Response,URL,FilesetResolver:{forVisionTasks:async()=>({wasmBinaryPath:"https://example.test/engine.wasm"})},HandLandmarker:{createFromOptions:async(_files,o)=>{options=o;return{detectForVideo:()=>({landmarks:[]})}}}});
 return{messages,self,get options(){return options}};
}
test('startup reports download progress and initializes from downloaded bytes',async()=>{
 const r=runtime(async()=>new Response(new Uint8Array([1,2,3]),{headers:{'content-length':'3'}}));
 await r.self.onmessage({data:{type:'init',origin:'https://example.test'}});
 assert.ok(r.messages.some(m=>m.message==='Downloading hand model · 100%'));
 assert.equal(r.messages.at(-1).type,'ready');assert.equal(r.options.baseOptions.modelAssetBuffer.length,3);
 let closed=false;await r.self.onmessage({data:{type:'frame',bitmap:{close(){closed=true}},time:10}});assert.equal(r.messages.at(-1).type,'result');assert.ok(closed);
});
test('missing tracking model reports an error instead of remaining in preparation',async()=>{
 const r=runtime(async()=>new Response('',{status:404}));await r.self.onmessage({data:{type:'init',origin:'https://example.test'}});
 assert.equal(r.messages.at(-1).type,'error');assert.match(r.messages.at(-1).message,/404/);
});
