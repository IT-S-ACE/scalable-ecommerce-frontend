import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import type { CartItem, Product } from '../../../shared/model/types';
import { primaryImage } from '../../../shared/model/types';
interface CartContextValue {items:CartItem[];count:number;subtotal:number;add:(p:Product)=>void;setQuantity:(id:number,q:number)=>void;remove:(id:number)=>void;clear:()=>void}
const CartContext=createContext<CartContextValue|null>(null);
function readCart(key:string):CartItem[]{try{const a=JSON.parse(localStorage.getItem(key)||'[]') as unknown;if(!Array.isArray(a))return [];return a.filter((x):x is CartItem=>x&&typeof x==='object'&&Number.isInteger((x as CartItem).productId)&&Number.isInteger((x as CartItem).quantity)&&typeof (x as CartItem).name==='string').slice(0,50).map(x=>({...x,quantity:Math.max(1,Math.min(1000,x.quantity))}));}catch{return []}}
export function CartProvider({children}:{children:ReactNode}){
 const {user}=useAuth();const key=`nova-cart-${user?.id??'anonymous'}`;
 const [cart,setCart]=useState<{key:string;items:CartItem[]}>(()=>({key,items:readCart(key)}));
 const items=cart.key===key?cart.items:readCart(key);
 useEffect(()=>{if(cart.key!==key)setCart({key,items:readCart(key)})},[cart.key,key]);
 useEffect(()=>{if(cart.key===key)localStorage.setItem(key,JSON.stringify(cart.items))},[cart,key]);
 const update=(fn:(old:CartItem[])=>CartItem[])=>setCart(previous=>({key,items:fn(previous.key===key?previous.items:readCart(key))}));
 const add=(p:Product)=>{if(!p.isActive)return;update(old=>{const found=old.find(x=>x.productId===p.id);if(found)return old.map(x=>x.productId===p.id?{...x,quantity:Math.min(1000,x.quantity+1)}:x);if(old.length>=50)return old;return [...old,{productId:p.id,name:p.name,price:p.price,imageUrl:primaryImage(p),quantity:1,isActive:p.isActive}]})};
 const setQuantity=(id:number,q:number)=>update(old=>old.map(x=>x.productId===id?{...x,quantity:Math.max(1,Math.min(1000,q))}:x));
 const remove=(id:number)=>update(old=>old.filter(x=>x.productId!==id));
 const clear=()=>update(()=>[]);
 const count=useMemo(()=>items.reduce((s,x)=>s+x.quantity,0),[items]);const subtotal=useMemo(()=>items.reduce((s,x)=>s+x.price*x.quantity,0),[items]);
 return <CartContext.Provider value={{items,count,subtotal,add,setQuantity,remove,clear}}>{children}</CartContext.Provider>
}
export function useCart(){const v=useContext(CartContext);if(!v)throw new Error('useCart outside provider');return v}
