import { ApiProperty } from '@nestjs/swagger';

export class AvatarPreviewDTO {
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  createdAt: Date;
}
