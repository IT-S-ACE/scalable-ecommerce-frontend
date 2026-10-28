import {Navigate,Route,Routes,useLocation} from 'react-router-dom';
import {useAuth} from '../features/auth/context/AuthContext';
import {AdminLayout,Layout} from '../shared/ui/Layout';
import {Spinner} from '../shared/ui/UI';
import {AuthPage} from '../features/auth/pages/AuthPage';
import {ShopPage} from '../features/shop/pages/ShopPage';
import {ProductDetailsPage} from '../features/products/pages/ProductDetailsPage';
import {CartPage} from '../features/cart/pages/CartPage';
import {OrdersPage} from '../features/orders/pages/OrdersPage';
import {OrderDetailsPage} from '../features/orders/pages/OrderDetailsPage';
import {ProfilePage} from '../features/users/pages/ProfilePage';
import {UsersPage} from '../features/users/pages/UsersPage';
import {DashboardPage} from '../features/dashboard/pages/DashboardPage';
import {CategoriesPage} from '../features/categories/pages/CategoriesPage';
import {ProductsPage} from '../features/products/pages/ProductsPage';
function RequireAuth({admin=false}:{admin?:boolean}){const {user,loading}=useAuth();const location=useLocation();if(loading)return <div className="screen-loading"><Spinner label="جارٍ التحقق من الجلسة..."/></div>;if(!user)return <Navigate to="/login" replace state={{from:location.pathname}}/>;if(admin&&user.role!=='RESPONSIBLE')return <Navigate to="/" replace/>;return admin?<AdminLayout/>:<Layout/>}
function GuestOnly(){const {user,loading}=useAuth();if(loading)return <Spinner/>;return user?<Navigate to="/" replace/>:<AuthPage/>}
export function App(){return <Routes><Route path="/login" element={<GuestOnly/>}/><Route path="/register" element={<GuestOnly/>}/><Route element={<RequireAuth/>}><Route index element={<ShopPage/>}/><Route path="products/:id" element={<ProductDetailsPage/>}/><Route path="cart" element={<CartPage/>}/><Route path="orders" element={<OrdersPage/>}/><Route path="orders/:id" element={<OrderDetailsPage/>}/><Route path="profile" element={<ProfilePage/>}/></Route><Route path="/admin" element={<RequireAuth admin/>}><Route index element={<DashboardPage/>}/><Route path="products" element={<ProductsPage/>}/><Route path="categories" element={<CategoriesPage/>}/><Route path="orders" element={<OrdersPage admin/>}/><Route path="users" element={<UsersPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
