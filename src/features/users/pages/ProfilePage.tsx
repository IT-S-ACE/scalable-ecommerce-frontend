import { useUser } from '../hooks/useUsers';
import { useState } from 'react';
import { CalendarDays, CircleUserRound, Mail, Phone, UserRound } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { dateTime } from '../../../shared/model/types';
import { PageHeading } from '../../../shared/ui/Layout';
import { ErrorNotice } from '../../../shared/ui/UI';

export function ProfilePage(){const {user,reload}=useAuth();
 const profile=useUser(user?.id??null);const details=profile.data??null;
 const [busy,setBusy]=useState(false);const [error,setError]=useState<unknown>(null);
 const refresh=async()=>{setBusy(true);setError(null);try{await Promise.all([profile.refetch(),reload()])}catch(e){setError(e)}finally{setBusy(false)}};
 const current=details??user;
 return <div className="container standard-page"><PageHeading eyebrow="إدارة الحساب" title="ملفي الشخصي" description="تفاصيل الحساب المسجل في النظام." actions={<button className="btn secondary" disabled={busy} onClick={refresh}>تحديث بياناتي</button>}/>{(error||profile.error)&&<ErrorNotice error={error||profile.error}/>}<div className="profile-grid"><div className="panel profile-main"><div className="profile-avatar">{current?.name?.charAt(0)}</div><h2>{current?.name}</h2><p>{current?.email}</p><span className={`badge ${current?.role==='RESPONSIBLE'?'violet':'green'}`}>{current?.role==='RESPONSIBLE'?'مسؤول المتجر':'حساب عميل'}</span></div><div className="panel profile-fields"><h2>بيانات الحساب</h2><div className="profile-field"><CircleUserRound size={19}/><span>الاسم الكامل</span><strong>{current?.name??'—'}</strong></div><div className="profile-field"><Mail size={19}/><span>البريد الإلكتروني</span><strong dir="ltr">{current?.email??'—'}</strong></div><div className="profile-field"><Phone size={19}/><span>رقم الهاتف</span><strong>{current?.phone??'غير مسجل'}</strong></div><div className="profile-field"><UserRound size={19}/><span>الجنس</span><strong>{current?.gender==='FEMALE'?'أنثى':'ذكر'}</strong></div><div className="profile-field"><CalendarDays size={19}/><span>تاريخ التسجيل</span><strong>{current?.createdAt?dateTime(current.createdAt):'—'}</strong></div><p className="hint profile-hint">الـ Backend الحالي يتيح قراءة بيانات الحساب فقط؛ لا توجد API لتعديل الملف الشخصي أو كلمة المرور.</p></div></div></div>}
