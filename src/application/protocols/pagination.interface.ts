export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  nextPage?: number | null;
};

export type PaginatedRequest<T> = T & {
  page?: number;
  limit?: number;
};
