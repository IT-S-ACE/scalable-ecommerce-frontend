import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {usersApi} from '../api/users.api';
import type {CreateUser} from '../../../shared/model/types';
export const userKeys={all:['users'] as const,detail:(id:number)=>['users','detail',id] as const};
export function useUsers(){return useQuery({queryKey:userKeys.all,queryFn:usersApi.list});}
export function useUser(id:number|null){return useQuery({queryKey:userKeys.detail(id??0),queryFn:()=>usersApi.get(id!),enabled:id!==null});}
export function useCreateUser(){const qc=useQueryClient();return useMutation({mutationFn:(data:CreateUser)=>usersApi.create(data),onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:userKeys.all}),qc.invalidateQueries({queryKey:['dashboard']})]);}});}
