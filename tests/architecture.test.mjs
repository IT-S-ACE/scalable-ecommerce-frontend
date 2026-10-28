import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
const fromRoot=(p)=>resolve(import.meta.dirname,'..',p);
const read=(p)=>readFileSync(fromRoot(p),'utf8');
const features=['auth','users','categories','products','orders','cart','shop','dashboard'];
test('each feature owns its folder',()=>{
 for(const name of features)assert(existsSync(fromRoot(`src/features/${name}`)),`Missing ${name}`);
});
test('query provider wraps feature routes',()=>{
 assert.match(read('src/app/AppProviders.tsx'),/QueryClientProvider/);
 assert.match(read('src/app/App.tsx'),/features\/orders\/pages\/OrdersPage/);
});
test('API adapters cover 21 NestJS endpoint operations',()=>{
 const operations={
  auth:['POST /auth/login','POST /auth/register','GET /auth/me'],
  users:['GET /users','GET /users/:id','POST /users'],
  categories:['GET /categories','GET /categories/:id','POST /categories','PATCH /categories/:id','DELETE /categories/:id'],
  products:['GET /products','GET /products/:id','POST /products','PATCH /products/:id','DELETE /products/:id'],
  orders:['GET /orders','GET /orders/:id','POST /orders','PATCH /orders/:id/status','DELETE /orders/:id'],
 };
 let count=0;
 for(const [domain,entries] of Object.entries(operations)){
  const source=read(`src/features/${domain}/api/${domain}.api.ts`);
  for(const entry of entries){
   const [method,path]=entry.split(' ');
   const normalized=path.replace(':id','${id}');
   assert(source.includes(normalized),`${domain} missing ${entry}`);
   if(method==='DELETE')assert(source.includes("method:'DELETE'"),`Missing delete method for ${domain}`);
   if(method==='PATCH')assert(source.includes("json('PATCH'"),`Missing patch method for ${domain}`);
   if(method==='POST')assert(source.includes("json('POST'"),`Missing post method for ${domain}`);
   count++;
  }
 }
 assert.equal(count,21);
});
test('query and mutation hooks own cache invalidation',()=>{
 for(const domain of ['products','categories','orders','users']){
  const file=read(`src/features/${domain}/hooks/use${domain[0].toUpperCase()+domain.slice(1)}.ts`);
  assert.match(file,/useMutation/);
  assert.match(file,/invalidateQueries/);
 }
});
