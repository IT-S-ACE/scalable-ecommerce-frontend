import {ApiError,request,json,queryParams} from '../../../shared/api/http';
import type {Order,OrderPayload,OrderStatus,Paginated,SearchFilters} from '../../../shared/model/types';
const wait=(milliseconds:number)=>new Promise(resolve=>setTimeout(resolve,milliseconds));
export const ordersApi={
  list:(query?:SearchFilters)=>request<Paginated<Order>>(`/orders${queryParams(query)}`),
  get:(id:number)=>request<Order>(`/orders/${id}`),
  create:(body:OrderPayload)=>request<Order>('/orders',json('POST',body)),
  async createWithRetry(body:OrderPayload):Promise<Order>{
    const idempotencyKey=crypto.randomUUID();
    for(let attempt=0;attempt<3;attempt++){
      try{
        return await request<Order>('/orders',{
          ...json('POST',body),
          headers:{'Idempotency-Key':idempotencyKey},
        });
      }catch(error){
        const retryable=error instanceof ApiError&&(error.status===0||error.status===503);
        if(!retryable||attempt===2)throw error;
        await wait(500*2**attempt);
      }
    }
    throw new Error('تعذّر إنشاء الطلب.');
  },
  updateStatus:(id:number,status:OrderStatus)=>request<Order>(`/orders/${id}/status`,json('PATCH',{status})),
  delete:(id:number)=>request<void>(`/orders/${id}`,{method:'DELETE'}),
};
