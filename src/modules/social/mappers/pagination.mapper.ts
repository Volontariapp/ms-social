import type { PaginationRequestDTO } from '../dto/common/pagination.dto.js';
import type { PaginationResponseDTO } from '../dto/response/pagination-response.dto.js';
import type { PaginationResultVO } from '@volontariapp/domain-social';
import { PaginationVO } from '@volontariapp/domain-social';

export class PaginationMapper {
  static toPaginationVO(dto: PaginationRequestDTO): PaginationVO {
    return new PaginationVO(dto.page, dto.limit);
  }

  static toPaginationResponseDTO(
    pagination: PaginationResultVO,
  ): PaginationResponseDTO {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }
}
