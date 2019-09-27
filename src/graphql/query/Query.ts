export interface WithPagination<TData> {
  items: TData[];
  cursor: Pagination;
}

export type Pagination = {
  total: number;
  perPage: number;
  currentPage: number;
  hasPages: boolean;
}


export interface WithPaginationVars {
  offset: number;
  limit: number;
}

export type SortField = 'asc' | 'desc';
