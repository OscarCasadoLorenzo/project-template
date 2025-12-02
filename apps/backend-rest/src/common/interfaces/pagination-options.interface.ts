export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

export interface PaginationOptions {
  limit: number;
  offset: number;
  sort?: SortOption[];
  fields?: string[];
  search?: string;
}

export interface PrismaFindOptions {
  take: number;
  skip: number;
  orderBy?: Record<string, "asc" | "desc">[];
  select?: Record<string, boolean>;
  where?: Record<string, unknown>;
}
