import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsMoney } from '../../../common/validators/is-money.validator.ts';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDTO {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  destinationId: number;

  @ApiProperty()
  @IsMoney()
  amount: string;
}
