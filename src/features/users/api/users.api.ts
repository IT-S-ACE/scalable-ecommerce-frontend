import {request,json} from '../../../shared/api/http';
import type {CreateUser,User} from '../../../shared/model/types';
export const usersApi={
  list:()=>request<User[]>('/users'),
  get:(id:number)=>request<User>(`/users/${id}`),
  create:(body:CreateUser)=>request<User>('/users',json('POST',body)),
};
