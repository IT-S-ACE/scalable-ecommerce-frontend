import type {ReactNode} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router-dom';
import {queryClient} from './queryClient';
import {AuthProvider} from '../features/auth/context/AuthContext';
import {CartProvider} from '../features/cart/context/CartContext';
export function AppProviders({children}:{children:ReactNode}){return <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider><CartProvider>{children}</CartProvider></AuthProvider></BrowserRouter></QueryClientProvider>}
