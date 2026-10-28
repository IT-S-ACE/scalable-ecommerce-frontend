import {useMutation,useQuery} from '@tanstack/react-query';
import {authApi} from '../api/auth.api';
export const authKeys={me:(id:number)=>['auth','me',id] as const};
export function useMe(id:number|undefined){return useQuery({queryKey:authKeys.me(id??0),queryFn:authApi.me,enabled:id!==undefined,retry:false,staleTime:30_000});}
export function useLogin(){return useMutation({mutationFn:({email,password}:{email:string;password:string})=>authApi.login(email,password)});}
export function useRegister(){return useMutation({mutationFn:authApi.register});}
