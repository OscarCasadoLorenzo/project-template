import { fetchApi } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useApiQuery<TData = unknown>(
  endpoint: string,
  config: any = {}
) {
  const { params, headers, ...queryOptions } = config;

  return useQuery<TData>({
    queryKey: [endpoint, params],
    queryFn: () => fetchApi<TData>(endpoint, { headers }),
    ...queryOptions,
  });
}

export function useApiMutation(
  endpoint: string,
  method: string,
  config: any = {}
) {
  return useMutation({
    mutationFn: (variables: any) =>
      fetchApi(endpoint, {
        method,
        body: variables,
      }),
    ...config,
  });
}
