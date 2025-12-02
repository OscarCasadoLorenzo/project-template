import { useApiQuery } from "@/hooks/use-api-query";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useUsers = (page = 1, limit = 100) => {
  const result = useApiQuery<UsersResponse>(
    `/users?page=${page}&limit=${limit}`,
  );

  return {
    ...result,
    data: result.data?.data ?? [],
    meta: result.data?.meta,
  };
};

export const useUser = (id: string) => {
  return useApiQuery<User>(`/users/${id}`, {
    enabled: !!id,
  });
};
