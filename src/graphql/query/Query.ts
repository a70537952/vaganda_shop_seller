export interface WithPagination<TData> {
  items: TData[];
  cursor: {
    total: number;
    perPage: number;
    currentPage: number;
    hasPages: boolean;
  };
}

export interface WithPaginationVars {
  offset: number;
  limit: number;
}

export type SortField = 'asc' | 'desc';
