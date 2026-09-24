export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaginationUtil {
  static paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginationResult<T> {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static getSkipLimit(page: number = 1, limit: number = 10): { skip: number; limit: number } {
    const p = Math.max(1, page);
    const l = Math.max(1, limit);
    return {
      skip: (p - 1) * l,
      limit: l,
    };
  }
}
