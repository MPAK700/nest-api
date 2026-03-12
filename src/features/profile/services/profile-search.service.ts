import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProfileAvatarRow } from '../types/profile-avatar-row.type.ts';
import { PaginatedResultDTO } from '../../../common/pagiantion/paginated.dto.ts';
import { ProfileAvatarResponseDTO } from '../dto/profile-avatar-response.dto.ts';
import { PaginationMapper } from '../../../common/pagiantion/pagination.mapper.ts';
import { ProfileMapper } from '../mapper/profile.mapper.ts';

@Injectable()
export class ProfileSearchService {
  private readonly logger = new Logger(ProfileSearchService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getActiveProfiles(
    minAge: number,
    maxAge: number,
    limit: number,
    page: number,
  ): Promise<PaginatedResultDTO<ProfileAvatarResponseDTO>> {
    const offset = (page - 1) * limit;

    const rows: ProfileAvatarRow[] = await this.dataSource.query(
      `
    SELECT
        p.login,
        p.email,
        p.age,
        p.description,
        a."fileName" AS "avatarFileName",
        a."createdAt" AS "avatarCreatedAt",
        COUNT(*) OVER() AS "totalCount"
    FROM profile p
    JOIN (
        SELECT profile_id
        FROM avatar
        WHERE "deletedAt" IS NULL
        GROUP BY profile_id
        HAVING COUNT(*) > 2
    ) ac ON ac.profile_id = p.id
    JOIN avatar a ON a.profile_id = p.id
      AND a."deletedAt" IS NULL
      AND a."createdAt" = (
          SELECT MAX("createdAt")
          FROM avatar
          WHERE profile_id = p.id AND "deletedAt" IS NULL
      )
    WHERE p."deletedAt" IS NULL
      AND p.description IS NOT NULL
      AND p.age BETWEEN $1 AND $2
    ORDER BY p.id
    LIMIT $3 OFFSET $4
  `,
      [minAge, maxAge, limit, offset],
    );

    if (rows.length === 0) {
      this.logger.warn('No active profiles found');
      throw new NotFoundException();
    }

    const totalItems = rows[0]?.totalCount ? Number(rows[0]?.totalCount) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedResult: PaginatedResultDTO<ProfileAvatarRow> = {
      items: rows,
      meta: {
        itemCount: rows.length,
        itemsPerPage: limit,
        currentPage: page,
        totalItems,
        totalPages,
      },
    };

    this.logger.log(`Found ${totalItems} active profiles`);
    return PaginationMapper.mapItems(paginatedResult, (item) =>
      ProfileMapper.toProfileAvatarDTO(item),
    );
  }
}
