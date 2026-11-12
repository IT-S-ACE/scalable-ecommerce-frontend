import type { AuthResponse, SearchFilters, User } from '../model/types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
const SESSION_KEY='nova-auth-session';
export interface Session { accessToken:string; expiresAt:number; user:User }
export const sessionStore={
  get():Session|null {try {const value=sessionStorage.getItem(SESSION_KEY); if(!value)return null; const session=JSON.parse(value) as Session; if(!session.accessToken||!session.user || Date.now()>=session.expiresAt) {sessionStorage.removeItem(SESSION_KEY);return null;} return session;} catch {sessionStorage.removeItem(SESSION_KEY);return null;}},
  set(response:AuthResponse){const s:Session={accessToken:response.accessToken,expiresAt:Date.now()+response.expiresIn*1000,user:response.user}; sessionStorage.setItem(SESSION_KEY,JSON.stringify(s));return s;},
  clear(){sessionStorage.removeItem(SESSION_KEY)},
};
export class ApiError extends Error {constructor(message:string,public status:number){super(message);this.name='ApiError'}}
const params=(values?:SearchFilters)=>{const q=new URLSearchParams();Object.entries(values||{}).forEach(([key,val])=>{if(val!==undefined&&val!==null&&val!=='')q.set(key,String(val));});return q.toString()?`?${q}`:''};
interface CachedResponse { etag:string; data:unknown }
const etagCache = new Map<string,CachedResponse>();
export async function request<T>(path:string,options:RequestInit={}):Promise<T>{
  const token=sessionStore.get()?.accessToken;
  const headers = new Headers(options.headers);
  const method=(options.method??'GET').toUpperCase();
  const cacheKey=`${method}:${BASE_URL}${path}`;
  const cached=method==='GET'?etagCache.get(cacheKey):undefined;
  if(options.body && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  if(token) headers.set('Authorization',`Bearer ${token}`);
  if(cached) headers.set('If-None-Match',cached.etag);
  let res:Response;
  try { res=await fetch(`${BASE_URL}${path}`,{...options,headers,cache:'no-store'}); }
  catch {throw new ApiError('تعذّر الاتصال بالخادم. تأكد من تشغيل NestJS وإعدادات الاتصال.',0);}
  if(res.status===304){
    if(cached)return cached.data as T;
    throw new ApiError('استلم الخادم استجابة 304 دون بيانات مخزنة محلياً.',304);
  }
  if(!res.ok){
    let errorMessage=`فشل الطلب (HTTP ${res.status})`;
    try {const data=await res.json() as {message?:string|string[]};if(data.message) errorMessage=Array.isArray(data.message)?data.message.join('، '):data.message;}catch {/* Non-JSON response */}
    if(res.status===401 && !path.startsWith('/auth/login') && !path.startsWith('/auth/register')){
      sessionStore.clear();window.dispatchEvent(new Event('nova:unauthorized'));
    }
    throw new ApiError(errorMessage,res.status);
  }
  if(res.status===204)return undefined as T;
  const data=await res.json() as T;
  const etag=res.headers.get('ETag');
  if(method==='GET'&&etag)etagCache.set(cacheKey,{etag,data});
  return data;
}

export const json = (method:'POST'|'PATCH',body:unknown):RequestInit=>({method,body:JSON.stringify(body)});
export const queryParams = params;
