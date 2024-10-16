export class PaginatedResponse<T> {
  public data: T[];
  public count: number;
  public page: number;
  public limit: number;

  public constructor(data: T[], count: number, page: number, limit: number) {
    this.data = data;
    this.count = count;
    this.page = page;
    this.limit = limit;
  }
}
