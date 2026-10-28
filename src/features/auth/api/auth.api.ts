import { request, json } from '../../../shared/api/http';
import type { AuthResponse, CreateUser, User } from '../../../shared/model/types';
export const authApi = {
  login: (email:string,password:string) => request<AuthResponse>('/auth/login',json('POST',{email,password})),
  register: (body:CreateUser) => request<AuthResponse>('/auth/register',json('POST',body)),
  me: () => request<User>('/auth/me'),
};
