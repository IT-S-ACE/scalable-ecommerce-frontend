export type Role = 'CUSTOMER' | 'RESPONSIBLE';
export type Gender = 'MALE' | 'FEMALE';
export interface User { id: number; name: string; email: string; phone: string | null; gender: Gender; role: Role; createdAt: string; updatedAt: string }
export interface AuthResponse { accessToken: string; tokenType: 'Bearer'; expiresIn: number; user: User }
export interface CreateUser { name: string; email: string; password: string; gender: Gender; phone?: string }
export interface PageMeta {page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean}
export interface Paginated<T> {data: T[]; meta: PageMeta}
export interface Category { id:number; name:string; slug:string; description:string|null; isActive:boolean; createdAt:string; updatedAt:string }
export interface CategoryPayload { name:string; slug?:string; description?:string|null; isActive?:boolean }
export interface ProductImage {id:number; imageUrl:string; isPrimary:boolean; sortOrder:number}
export interface ImagePayload {imageUrl:string; isPrimary?:boolean; sortOrder?:number}
export interface Product { id:number; name:string; description:string|null; price:number; categoryId:number; category:Category|null; isActive:boolean; images:ProductImage[]; createdAt:string; updatedAt:string }
export interface ProductPayload { name:string; description?:string|null; price:number; categoryId:number; isActive?:boolean; images?:ImagePayload[] }
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export interface OrderItem { id:number; productId:number; productName:string|null; quantity:number; unitPrice:number; lineTotal:number }
export interface Order { id:number; orderNumber:string; userId:number; status:OrderStatus; totalAmount:number; items:OrderItem[]; createdAt:string; updatedAt:string }
export interface OrderPayload { items: {productId:number; quantity:number}[] }
export interface CartItem { productId:number; name:string; price:number; imageUrl:string|null; quantity:number; isActive:boolean }
export type SearchFilters = Record<string, string | number | boolean | null | undefined>;
export const transitions: Record<OrderStatus,OrderStatus[]> = {PENDING:['CONFIRMED','CANCELLED'],CONFIRMED:['SHIPPED','CANCELLED'],SHIPPED:['DELIVERED'],DELIVERED:[],CANCELLED:[]};
export const statusText: Record<OrderStatus,string>={PENDING:'بانتظار التأكيد',CONFIRMED:'تم التأكيد',SHIPPED:'تم الشحن',DELIVERED:'تم التسليم',CANCELLED:'ملغي'};
export const statusClasses:Record<OrderStatus,string>={PENDING:'amber',CONFIRMED:'blue',SHIPPED:'violet',DELIVERED:'green',CANCELLED:'red'};
export const currencyCode=import.meta.env.VITE_CURRENCY || 'USD';
export const currency=(n:number|string)=>new Intl.NumberFormat('en-US',{style:'currency',currency:currencyCode,maximumFractionDigits:2}).format(Number(n)||0);
export const dateTime=(s:string)=>new Intl.DateTimeFormat('ar',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(s));
export function primaryImage(p:Product){return p.images.find(x=>x.isPrimary)?.imageUrl ?? p.images[0]?.imageUrl ?? null}
