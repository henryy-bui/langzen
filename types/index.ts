// types/index.ts

/** Standard API response wrapper — use in all API route handlers */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: PaginationMeta;
}>;
