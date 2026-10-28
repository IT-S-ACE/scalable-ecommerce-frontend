import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../shared/api/http';
export const queryClient = new QueryClient({defaultOptions:{
 queries:{staleTime:60_000,gcTime:5*60_000,retry:(count,error)=>count<1&&(!(error instanceof ApiError)||error.status>=500||error.status===0),refetchOnWindowFocus:false},
 mutations:{retry:false},
}});
