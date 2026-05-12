import { PaginatedResultDTO } from './paginated.dto.ts';

export class PaginationMapper {
  static mapItems<T, D>(
    result: PaginatedResultDTO<T>,
    mapper: (item: T) => D,
  ): PaginatedResultDTO<D> {
    return {
      items: result.items.map(mapper),
      meta: {
        ...result.meta,
      },
    };
  }
}
