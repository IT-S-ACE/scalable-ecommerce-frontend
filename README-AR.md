# NOVA Commerce — React Modular + TanStack Query

واجهة عربية RTL لمشروع Scalable E-Commerce المبني بـ NestJS. **نفس التصميم السابق دون تغيير في ملف CSS**، ولكن بتنظيم Feature-Based، مع نقل إدارة بيانات الخادم إلى TanStack Query v5.

## التشغيل المحلي (Backend منفصل)

**المتطلبات:** Node.js 20.19+ أو 22.12+، npm، وتشغيل مشروع NestJS الأصلي على `http://localhost:3000`.

```powershell
# من داخل مجلد NOVA_React_Frontend
npm install
npm run dev
```

افتح `http://localhost:5173`.

- Vite يمرر `/api/*` إلى `http://localhost:3000/*`، من دون الحاجة إلى CORS في وضع التطوير المحلي.
- لتغيير عنوان NestJS عدّل `server.proxy.target` في `vite.config.ts`، وأعد تشغيل Vite.
- انسخ `.env.example` إلى `.env` عند الحاجة. القيمة الافتراضية `VITE_API_BASE_URL=/api`، والعملة `USD`.
- للنسخة الإنتاجية: `npm run build` ثم `npm run preview` للتجربة. يستخدم ملف `Dockerfile` الموجود خدمة nginx عند تشغيل النسخة الكاملة.

## أوامر المشروع

```bash
npm run dev                 # Hot reload
npm run typecheck           # TypeScript
npm run build               # tsc + vite build
npm run test:architecture   # Node built-in test runner, لا يحتاج npm install
```

## لماذا Feature-Based؟

كل مجال أعمال يملك API adapter وQuery/Mutation Hooks وPages المرتبطة به؛ لا تعتمد الصفحات على `fetch` أو على ملفات API الخاصة بميزات أخرى مباشرة. يوجد `shared/` فقط للمكونات العامة والـ HTTP client والأنواع المشتركة، و`app/` لتوصيل Providers والمسارات.

```text
src/
├── app/
│   ├── App.tsx                   # Routes + authorization guards
│   ├── AppProviders.tsx          # BrowserRouter + QueryClientProvider + Context
│   └── queryClient.ts           # Global caching / retry policy
├── features/
│   ├── auth/                    # API + useMe/useLogin/useRegister + AuthContext + login/register
│   ├── cart/                    # Client-side cart context + cart page
│   ├── categories/              # CRUD API + query hooks + admin page
│   ├── dashboard/               # Composed read-only metrics + hooks + page
│   ├── orders/                  # CRUD/status API + hooks + pages
│   ├── products/                # CRUD API + hooks + pages
│   ├── shop/                    # ShopPage + ProductCard
│   └── users/                   # Users API + hooks + admin/profile pages
├── shared/
│   ├── api/http.ts              # Base URL + JWT + request/error handling
│   ├── model/types.ts           # Shared backend contracts / formatters
│   └── ui/{UI,Layout}.tsx       # Unchanged visual components
├── main.tsx
└── styles.css                   # Original design, byte-for-byte identical
```

## سياسة TanStack Query

| المجال | Query key مثال | سبب التحديث |
| --- | --- | --- |
| Authentication | `['auth','me', userId]` | تحديث الجلسة والتحقق من المستخدم |
| Categories | `['categories','list',filters]` | إنشاء/تعديل/حذف التصنيف |
| Category selector | `['categories','selector', active]` | مزامنة قوائم الاختيار |
| Products | `['products','list',filters]` | إنشاء/تعديل/حذف منتج، أو تعديل تصنيف |
| Product detail | `['products','detail',id]` | التغييرات في المنتجات |
| Orders | `['orders','list',scope,filters]` | إنشاء طلب، تغيير حالته، حذفه |
| Order detail | `['orders','detail',id]` | تغيير الحالة أو حذف الطلب |
| Users | `['users']`, `['users','detail',id]` | إضافة مستخدم |
| Dashboard | `['dashboard','stats']` | تحديث المنتجات والتصنيفات والطلبات والمستخدمين |

- `useQuery` لجلب بيانات الخادم مع caching و`staleTime` افتراضياً 60 ثانية.
- `useMutation` لإنشاء/تعديل/حذف السجلات مع `invalidateQueries` للمجال المتأثر والـ Dashboard؛ تتحدث البيانات تلقائياً بعد نجاح العملية.
- `keepPreviousData` يحافظ على نتائج الصفحة مؤقتاً أثناء التنقل بين صفحات Pagination.
- لا يُعاد إرسال طلبات `4xx` تلقائياً؛ إعادة محاولة واحدة فقط لأخطاء الشبكة و`5xx`.
- عند تسجيل الدخول أو الخروج يتم مسح Cache السابق لعزل بيانات الحسابات المختلفة.
- السلة **بيانات واجهة محلية** لذا بقيت في Context + `localStorage`. الـ JWT يُحفظ في `sessionStorage` كما في النسخة الأولى.

## API coverage: 21 operation

- Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`.
- Users: `GET /users`, `GET /users/:id`, `POST /users`.
- Categories: `GET /categories`, `GET /categories/:id`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`.
- Products: `GET /products`, `GET /products/:id`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`.
- Orders: `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status`, `DELETE /orders/:id`.

لا يوجد نظام دفع أو رفع صور أو تعديل ملف شخصي في Backend الحالي. تعتمد صور المنتجات على روابط `imageUrl` كما في المشروع الأصلي.

## حماية الصلاحيات

المسؤول `RESPONSIBLE` فقط يستطيع عرض Routes الإدارة، بالإضافة إلى حماية NestJS للـ APIs ذاتها. العميل `CUSTOMER` يملك صفحات المتجر والطلبات الخاصة به. الواجهة لا تمنح صلاحيات جديدة. **لا تعتبر Route Guard في React بديلاً عن التفويض في الخادم**.

## ملاحظة التحقق

تم فحص الاستيرادات، وصحة البنية النحوية لملفات TypeScript/TSX، وفحص الأنواع باستخدام تعريفات محلية مؤقتة، وتشغيل `npm run test:architecture`. لا يغني ذلك عن `npm install && npm run build` وEnd-to-End مع NestJS على جهازك، لأن الوصول إلى npm registry غير متاح في بيئة إعداد الملفات.
