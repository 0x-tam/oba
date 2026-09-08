import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import app from '../.vercel/output/functions/__server.func/index.mjs';
const projects=JSON.parse(readFileSync(new URL('../lib/projects.json',import.meta.url),'utf8'));
const get=path=>app.fetch(new Request('https://obacho.vercel.app'+path));
test('Vercel routes requests through the application function',()=>{
 const config=JSON.parse(readFileSync('.vercel/output/config.json','utf8'));
 assert.ok(config.routes.some(r=>r.src==='/(.*)'&&r.dest==='/__server'));
 assert.ok(existsSync('.vercel/output/functions/__server.func/.vc-config.json'));
});
test('every project and top-level page renders from the deployment bundle',async()=>{
 for(const path of ['/','/work','/work?category=interiors','/models','/profile',...projects.map(p=>'/work/'+p.id)]){
  const response=await get(path);assert.equal(response.status,200,path);
  const html=await response.text();assert.match(html,/width=device-width/,path);
  for(const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)"/g))assert.ok(existsSync('.vercel/output/static'+match[1]),'Missing asset: '+match[1]);
 }
});
test('unknown projects return a real 404',async()=>assert.equal((await get('/work/not-a-project')).status,404));
test('mobile CSS is compiled and includes safe-area and touch controls',async()=>{
 const html=await (await get('/')).text();const path=[...html.matchAll(/href="([^"?]+\.css)"/g)][0][1];
 const css=readFileSync('.vercel/output/static'+path,'utf8');
 assert.ok(css.includes('safe-area-inset-bottom'));
 assert.ok(css.includes('pointer:coarse')||css.includes('pointer: coarse'));
 assert.ok(css.includes('--header-height:124px'));
 assert.ok(!css.includes('@theme'));
});
test('only reviewed reconstructions are advertised as interactive models',async()=>{
 assert.deepEqual(projects.filter(p=>p.model).map(p=>p.model).sort(),['benina','thing']);
 const html=await (await get('/models')).text();
 assert.equal((html.match(/class="model-launch"/g)||[]).length,2);
 for(const id of ['landship','artists-studio-balcony','lebanese-concept-house','residence-du-parc']){
  const page=await (await get('/work/'+id)).text();assert.ok(!page.includes('class="model-launch"'));
  assert.ok(page.includes('Original portfolio sheets'));
 }
});
