export class PaginationEntity<T> {
  data: T[];
  count: number;
  limit: number;
  offset: number;
}
