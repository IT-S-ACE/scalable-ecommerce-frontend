import {productsApi} from '../../products/api/products.api';
import {categoriesApi} from '../../categories/api/categories.api';
import {ordersApi} from '../../orders/api/orders.api';
import {usersApi} from '../../users/api/users.api';
import type {Order,OrderStatus} from '../../../shared/model/types';
export interface DashboardStats{products:number;categories:number;orders:number;users:number;recent:Order[];statuses:Record<OrderStatus,number>}
export const dashboardApi={async stats():Promise<DashboardStats>{
 const statuses:OrderStatus[]=['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];
 const [products,categories,orders,users,...statusResponses]=await Promise.all([
 productsApi.list({limit:1}),categoriesApi.list({limit:1}),ordersApi.list({limit:5}),usersApi.list(),...statuses.map(status=>ordersApi.list({limit:1,status})),
 ]);
 return {products:products.meta.total,categories:categories.meta.total,orders:orders.meta.total,users:users.length,recent:orders.data,statuses:{PENDING:statusResponses[0].meta.total,CONFIRMED:statusResponses[1].meta.total,SHIPPED:statusResponses[2].meta.total,DELIVERED:statusResponses[3].meta.total,CANCELLED:statusResponses[4].meta.total}};
}};
