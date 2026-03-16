export class PaginatedResultDTO<T> {
  items: T[];
  meta: {
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalItems?: number;
    totalPages?: number;
  };
}
