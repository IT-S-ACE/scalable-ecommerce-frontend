import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import type {ReactNode} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {sessionStore} from '../../../shared/api/http';
import type {AuthResponse,CreateUser,User} from '../../../shared/model/types';
import {authApi} from '../api/auth.api';
import {authKeys,useLogin,useMe,useRegister} from '../hooks/useAuth';
interface AuthContextValue{user:User|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;register:(data:CreateUser)=>Promise<void>;logout:()=>void;reload:()=>Promise<void>}
const AuthContext=createContext<AuthContextValue|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const qc=useQueryClient();
 const [session,setSession]=useState(()=>sessionStore.get());
 const me=useMe(session?.user.id);
 const loginMutation=useLogin();const registerMutation=useRegister();
 const user=me.data??session?.user??null;
 const loading=Boolean(session)&&me.isPending;
 const logout=useCallback(()=>{sessionStore.clear();qc.clear();setSession(null);},[qc]);
 useEffect(()=>{window.addEventListener('nova:unauthorized',logout);return()=>window.removeEventListener('nova:unauthorized',logout);},[logout]);
 useEffect(()=>{if(session&&me.isError)logout();},[session,me.isError,logout]);
 useEffect(()=>{if(session&&me.data){const updated={...session,user:me.data};sessionStorage.setItem('nova-auth-session',JSON.stringify(updated));}},[session,me.data]);
 const save=(result:AuthResponse)=>{qc.clear();const next=sessionStore.set(result);setSession(next);qc.setQueryData(authKeys.me(result.user.id),result.user);};
 const login=async(email:string,password:string)=>save(await loginMutation.mutateAsync({email,password}));
 const register=async(data:CreateUser)=>save(await registerMutation.mutateAsync(data));
 const reload=async()=>{if(!session)return;const latest=await qc.fetchQuery({queryKey:authKeys.me(session.user.id),queryFn:authApi.me,staleTime:0});setSession(current=>current?{...current,user:latest}:current);};
 return <AuthContext.Provider value={{user,loading,login,register,logout,reload}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('useAuth outside provider');return value;}
