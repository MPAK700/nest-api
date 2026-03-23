import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDTO } from './profile-response.dto.ts';
import { AvatarPreviewDTO } from '../../avatar/dto/avatar-preview.dto.ts';

export class ProfileAvatarResponseDTO extends ProfileResponseDTO {
  @ApiProperty({ type: AvatarPreviewDTO, nullable: true })
  avatar: AvatarPreviewDTO | null;
}
