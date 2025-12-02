// Pagination types for generic use
export interface PaginationMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Helper type to handle both paginated and non-paginated responses
export type MaybePaginated<T> = T[] | PaginatedResponse<T>;
