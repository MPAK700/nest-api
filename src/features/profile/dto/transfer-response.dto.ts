import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDTO {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  sender: number;
  @ApiProperty()
  receiver: number;
  @ApiProperty()
  amount: string;
}
