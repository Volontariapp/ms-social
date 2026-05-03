import type { PaginatedIdsVO } from '@volontariapp/domain-social';
import type { IdsResponseDTO } from '../dto/base.response.dto.js';
import { PaginationMapper } from './pagination.mapper.js';

export class PaginatedIdsMapper {
  static toPaginatedIdsResponseDTO(vo: PaginatedIdsVO): IdsResponseDTO {
    return {
      ids: vo.ids,
      pagination: PaginationMapper.toPaginationResponseDTO(vo.pagination),
    };
  }
}
