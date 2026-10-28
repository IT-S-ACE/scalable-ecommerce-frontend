import {request,json,queryParams} from '../../../shared/api/http';
import type {Paginated,Product,ProductPayload,SearchFilters} from '../../../shared/model/types';
export const productsApi={
  list:(query?:SearchFilters)=>request<Paginated<Product>>(`/products${queryParams(query)}`),
  get:(id:number)=>request<Product>(`/products/${id}`),
  create:(body:ProductPayload)=>request<Product>('/products',json('POST',body)),
  update:(id:number,body:Partial<ProductPayload>)=>request<Product>(`/products/${id}`,json('PATCH',body)),
  delete:(id:number)=>request<void>(`/products/${id}`,{method:'DELETE'}),
};
