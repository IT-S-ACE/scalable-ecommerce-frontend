import { ProductCard } from '../components/ProductCard';
import { useProductList } from '../../products/hooks/useProducts';
import { useAllCategories } from '../../categories/hooks/useCategories';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Search, ShieldCheck, ShoppingBag, ShoppingCart, SlidersHorizontal, Sparkles, Truck, Zap } from 'lucide-react';
import { Empty, ErrorNotice, Pagination, Spinner } from '../../../shared/ui/UI';

const LIMIT=12;
export function ShopPage(){
 const [page,setPage]=useState(1);const [category,setCategory]=useState('');const [search,setSearch]=useState('');
 const {data:categoryResults}=useAllCategories(true);
 const categories=categoryResults??[];
 const productQuery=useProductList({page,limit:LIMIT,isActive:true,...(category?{categoryId:Number(category)}:{})});
 const products=productQuery.data?.data??[];
 const meta=productQuery.data?.meta??null;
 const loading=productQuery.isPending;const error=productQuery.error;
 const refetch=()=>{void productQuery.refetch()};
 const visible=useMemo(()=>products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()) || (p.description??'').toLowerCase().includes(search.toLowerCase())),[products,search]);
 return <div className="container shop-page"><div className="hero"><div className="hero-content"><span className="hero-tag"><Sparkles size={16}/> تشكيلة تستحق الاستكشاف</span><h1>اكتشف أشياء<br/><span>تستحق الاقتناء.</span></h1><p>منتجات مختارة بعناية، وتجربة تسوق مصممة لتناسب يومك. كل ما تحتاجه أصبح أقرب إليك.</p><a href="#catalog" className="btn white hero-btn">تسوق الآن <ArrowLeft size={18}/></a><div className="hero-mini-features"><span><ShieldCheck size={18}/> تسوق موثوق</span><span><Zap size={18}/> تجربة سريعة</span></div></div><div className="hero-art" aria-hidden="true"><div className="hero-ring ring-one"/><div className="hero-ring ring-two"/><div className="hero-glow"/><div className="hero-card hero-card-a"><span className="hero-symbol">✦</span><strong>MORE</strong><small>to explore.</small></div><div className="hero-card hero-card-b"><ShoppingBag size={40}/><span>NOVA PICKS</span></div><span className="hero-asterisk">✳</span></div></div>
 <div className="benefits"><div><div className="benefit-icon"><Truck size={24}/></div><div><b>طلب في دقائق</b><span>أكمل طلبك بخطوات بسيطة</span></div></div><div><div className="benefit-icon"><ShieldCheck size={24}/></div><div><b>تجربة آمنة</b><span>طلبات محمية بصلاحيات الوصول</span></div></div><div><div className="benefit-icon"><Package size={24}/></div><div><b>تتبّع طلباتك</b><span>اعرف حالة كل طلب بوضوح</span></div></div></div>
 <section id="catalog" className="catalog"><div className="catalog-heading"><div><span className="eyebrow">الكتالوج</span><h2>استكشف <em>منتجاتنا</em></h2><p>تصفح الفئات واختر ما يناسب احتياجاتك</p></div><span className="catalog-total">{meta?.total??0} منتج</span></div><div className="catalog-controls"><div className="category-pills"><button className={!category?'active':''} onClick={()=>{setCategory('');setPage(1);setSearch('')}}>جميع المنتجات</button>{categories.map(c=><button key={c.id} className={category===String(c.id)?'active':''} onClick={()=>{setCategory(String(c.id));setPage(1);setSearch('')}}>{c.name}</button>)}</div><div className="catalog-search"><Search size={18}/><input aria-label="البحث ضمن الصفحة" placeholder="ابحث ضمن هذه الصفحة..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="filter-info"><SlidersHorizontal size={15}/> {search?'يُطبق البحث على منتجات الصفحة الحالية فقط.':'يعرض الكتالوج المنتجات النشطة فقط.'}</div>
 {error?<ErrorNotice error={error} onRetry={refetch}/>:loading?<Spinner/>:visible.length?<div className="products-grid">{visible.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<Empty title="لم نعثر على منتجات" description="جرّب فئة أخرى أو أزل نص البحث."/>}
 {meta&&!error&&!loading&&<Pagination meta={meta} onChange={p=>{setPage(p);document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})}}/>}</section><section className="shop-cta"><div><span className="eyebrow">NOVA COMMERCE</span><h2>تسوّق على طريقتك.</h2><p>يمكنك إضافة المنتجات إلى السلة وإرسال طلبك في أي وقت.</p></div><Link to="/cart" className="btn primary">عرض سلة المشتريات <ShoppingCart size={18}/></Link></section></div>}
