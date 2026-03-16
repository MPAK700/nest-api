import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { PaginationQueryDTO } from '../../../common/pagiantion/pagination-query.dto.ts';

export class ActiveProfilesQueryDTO extends PaginationQueryDTO {
  @Type(() => Number)
  @IsPositive()
  minAge: number;

  @Type(() => Number)
  @IsPositive()
  maxAge: number;
}
