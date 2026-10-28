import {keepPreviousData,useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {ordersApi} from '../api/orders.api';
import type {OrderPayload,OrderStatus,SearchFilters} from '../../../shared/model/types';
export const orderKeys={all:['orders'] as const,list:(scope:string|number,filters:SearchFilters)=>['orders','list',scope,filters] as const,detail:(id:number)=>['orders','detail',id] as const};
export function useOrderList(filters:SearchFilters,scope:string|number){return useQuery({queryKey:orderKeys.list(scope,filters),queryFn:()=>ordersApi.list(filters),placeholderData:keepPreviousData});}
export function useOrderDetail(id:number|null){return useQuery({queryKey:orderKeys.detail(id??0),queryFn:()=>ordersApi.get(id!),enabled:id!==null&&Number.isFinite(id)&&id>0});}
function useInvalidateOrders(){const qc=useQueryClient();return async()=>{await Promise.all([qc.invalidateQueries({queryKey:orderKeys.all}),qc.invalidateQueries({queryKey:['dashboard']})]);};}
export function useCreateOrder(){const refresh=useInvalidateOrders();return useMutation({mutationFn:(data:OrderPayload)=>ordersApi.create(data),onSuccess:refresh});}
export function useUpdateOrderStatus(){const refresh=useInvalidateOrders();return useMutation({mutationFn:({id,status}:{id:number;status:OrderStatus})=>ordersApi.updateStatus(id,status),onSuccess:refresh});}
export function useDeleteOrder(){const refresh=useInvalidateOrders();return useMutation({mutationFn:ordersApi.delete,onSuccess:refresh});}
