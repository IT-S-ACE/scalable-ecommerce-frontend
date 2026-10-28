import {request,json,queryParams} from '../../../shared/api/http';
import type {Category,CategoryPayload,Paginated,SearchFilters} from '../../../shared/model/types';
export const categoriesApi={
  list:(query?:SearchFilters)=>request<Paginated<Category>>(`/categories${queryParams(query)}`),
  get:(id:number)=>request<Category>(`/categories/${id}`),
  create:(body:CategoryPayload)=>request<Category>('/categories',json('POST',body)),
  update:(id:number,body:Partial<CategoryPayload>)=>request<Category>(`/categories/${id}`,json('PATCH',body)),
  delete:(id:number)=>request<void>(`/categories/${id}`,{method:'DELETE'}),
};
/** The category list is paginated even for select controls. */
export async function loadAllCategories(isActive?:boolean):Promise<Category[]>{
  const all:Category[]=[];
  for(let page=1;page<=1000;page++){
    const response=await categoriesApi.list({page,limit:100,isActive});
    all.push(...response.data);
    if(!response.meta.hasNextPage||!response.data.length)return all;
  }
  throw new Error('تجاوز عدد صفحات التصنيفات الحد المسموح.');
}
