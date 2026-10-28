import {keepPreviousData,useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {categoriesApi,loadAllCategories} from '../api/categories.api';
import type {CategoryPayload,SearchFilters} from '../../../shared/model/types';
export const categoryKeys={all:['categories'] as const,lists:['categories','list'] as const,list:(f:SearchFilters)=>['categories','list',f] as const,detail:(id:number)=>['categories','detail',id] as const,selector:(active?:boolean)=>['categories','selector',active??'all'] as const};
export function useCategoryList(filters:SearchFilters){return useQuery({queryKey:categoryKeys.list(filters),queryFn:()=>categoriesApi.list(filters),placeholderData:keepPreviousData});}
export function useAllCategories(active?:boolean){return useQuery({queryKey:categoryKeys.selector(active),queryFn:()=>loadAllCategories(active)});}
export function useCategoryDetail(id:number|null){return useQuery({queryKey:categoryKeys.detail(id??0),queryFn:()=>categoriesApi.get(id!),enabled:id!==null});}
export function useCreateCategory(){const qc=useQueryClient();return useMutation({mutationFn:(data:CategoryPayload)=>categoriesApi.create(data),onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:categoryKeys.all}),qc.invalidateQueries({queryKey:['dashboard']})]);}});}
export function useUpdateCategory(){const qc=useQueryClient();return useMutation({mutationFn:({id,data}:{id:number;data:Partial<CategoryPayload>})=>categoriesApi.update(id,data),onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:categoryKeys.all}),qc.invalidateQueries({queryKey:['products']}),qc.invalidateQueries({queryKey:['dashboard']})]);}});}
export function useDeleteCategory(){const qc=useQueryClient();return useMutation({mutationFn:categoriesApi.delete,onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:categoryKeys.all}),qc.invalidateQueries({queryKey:['products']}),qc.invalidateQueries({queryKey:['dashboard']})]);}});}
