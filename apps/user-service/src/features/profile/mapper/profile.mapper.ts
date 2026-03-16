import { ProfileAvatarResponseDTO } from '../dto/profile-avatar-response.dto.ts';
import { ProfileResponseDTO } from '../dto/profile-response.dto.ts';
import { Profile } from '../entity/profile.entity.ts';
import { ProfileAvatarRow } from '../types/profile-avatar-row.type.ts';

export class ProfileMapper {
  static toDTO(profile: Profile): ProfileResponseDTO {
    return {
      email: profile.email,
      login: profile.login,
      age: profile.age,
      description: profile.description,
    };
  }

  static toProfileAvatarDTO(row: ProfileAvatarRow): ProfileAvatarResponseDTO {
    return {
      email: row.email,
      login: row.login,
      age: row.age,
      description: row.description,
      avatar:
        row.avatarFileName && row.avatarCreatedAt
          ? {
              fileName: row.avatarFileName,
              createdAt: row.avatarCreatedAt,
            }
          : null,
    };
  }
}
