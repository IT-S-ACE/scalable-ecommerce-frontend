import {useQuery} from '@tanstack/react-query';
import {dashboardApi} from '../api/dashboard.api';
export const dashboardKeys={stats:['dashboard','stats'] as const};
export function useDashboardStats(){return useQuery({queryKey:dashboardKeys.stats,queryFn:dashboardApi.stats,staleTime:30_000});}
