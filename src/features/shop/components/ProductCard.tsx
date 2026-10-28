import {Link} from 'react-router-dom';
import {CheckCircle2,Plus,Sparkles} from 'lucide-react';
import type {Product} from '../../../shared/model/types';
import {currency,primaryImage} from '../../../shared/model/types';
import {useCart} from '../../cart/context/CartContext';
import {ImageTile} from '../../../shared/ui/UI';
export function ProductCard({product}:{product:Product}){const {add,items}=useCart();const inCart=items.find(x=>x.productId===product.id);return <article className="product-card"><Link to={`/products/${product.id}`} className="product-image-link"><ImageTile src={primaryImage(product)} alt={product.name} className="product-card-image"/><span className="product-bubble"><Sparkles size={13}/> مختار لك</span></Link><div className="product-card-body"><span className="product-category">{product.category?.name??'منتجات NOVA'}</span><Link to={`/products/${product.id}`} className="product-name">{product.name}</Link><div className="product-rating"><CheckCircle2 size={13}/><small>متاح للتصفح</small></div><div className="product-card-bottom"><span className="product-price">{currency(product.price)}</span><button aria-label={`أضف ${product.name} إلى السلة`} title="إضافة إلى السلة" onClick={()=>add(product)} className={`product-add ${inCart?'added':''}`}>{inCart?<CheckCircle2 size={19}/>:<Plus size={21}/>}</button></div></div></article>}
