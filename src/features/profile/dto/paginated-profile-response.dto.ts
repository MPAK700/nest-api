import { ProfileResponseDTO } from './profile-response.dto.ts';

export class PaginatedProfileResponseDTO {
  items: ProfileResponseDTO[];
  meta: {
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalItems?: number;
    totalPages?: number;
  };
}
