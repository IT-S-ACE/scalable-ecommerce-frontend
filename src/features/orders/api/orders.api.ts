import {request,json,queryParams} from '../../../shared/api/http';
import type {Order,OrderPayload,OrderStatus,Paginated,SearchFilters} from '../../../shared/model/types';
export const ordersApi={
  list:(query?:SearchFilters)=>request<Paginated<Order>>(`/orders${queryParams(query)}`),
  get:(id:number)=>request<Order>(`/orders/${id}`),
  create:(body:OrderPayload)=>request<Order>('/orders',json('POST',body)),
  updateStatus:(id:number,status:OrderStatus)=>request<Order>(`/orders/${id}/status`,json('PATCH',{status})),
  delete:(id:number)=>request<void>(`/orders/${id}`,{method:'DELETE'}),
};
