import {keepPreviousData,useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {productsApi} from '../api/products.api';
import type {ProductPayload,SearchFilters} from '../../../shared/model/types';
export const productKeys={all:['products'] as const,lists:['products','list'] as const,list:(f:SearchFilters)=>['products','list',f] as const,detail:(id:number)=>['products','detail',id] as const};
export function useProductList(filters:SearchFilters){return useQuery({queryKey:productKeys.list(filters),queryFn:()=>productsApi.list(filters),placeholderData:keepPreviousData});}
export function useProductDetail(id:number|null){return useQuery({queryKey:productKeys.detail(id??0),queryFn:()=>productsApi.get(id!),enabled:id!==null&&Number.isFinite(id)&&id>0});}
function useInvalidateProducts(){const qc=useQueryClient();return async()=>{await Promise.all([qc.invalidateQueries({queryKey:productKeys.all}),qc.invalidateQueries({queryKey:['dashboard']})]);};}
export function useCreateProduct(){const refresh=useInvalidateProducts();return useMutation({mutationFn:(data:ProductPayload)=>productsApi.create(data),onSuccess:refresh});}
export function useUpdateProduct(){const refresh=useInvalidateProducts();return useMutation({mutationFn:({id,data}:{id:number;data:Partial<ProductPayload>})=>productsApi.update(id,data),onSuccess:refresh});}
export function useDeleteProduct(){const refresh=useInvalidateProducts();return useMutation({mutationFn:productsApi.delete,onSuccess:refresh});}
