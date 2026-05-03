import { PaginationMapper } from '../../../common/mappers/pagination.mapper';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto';
import { PaginationVO, PaginationResultVO } from '@volontariapp/domain-social';

describe('PaginationMapper', () => {
  describe('toPaginationVO', () => {
    it('should convert PaginationRequestDTO to PaginationVO', () => {
      const dto: PaginationRequestDTO = {
        page: 1,
        limit: 10,
      };
      const result = PaginationMapper.toPaginationVO(dto);
      expect(result).toBeInstanceOf(PaginationVO);
    });

    it('should handle page 1 with limit 10', () => {
      const dto: PaginationRequestDTO = { page: 1, limit: 10 };
      const result = PaginationMapper.toPaginationVO(dto);
      expect(result).toBeInstanceOf(PaginationVO);
    });

    it('should handle large page numbers', () => {
      const dto: PaginationRequestDTO = { page: 100, limit: 50 };
      const result = PaginationMapper.toPaginationVO(dto);
      expect(result).toBeInstanceOf(PaginationVO);
    });

    it('should handle minimum valid values', () => {
      const dto: PaginationRequestDTO = { page: 1, limit: 1 };
      const result = PaginationMapper.toPaginationVO(dto);
      expect(result).toBeInstanceOf(PaginationVO);
    });

    it('should handle large limit values', () => {
      const dto: PaginationRequestDTO = { page: 1, limit: 1000 };
      const result = PaginationMapper.toPaginationVO(dto);
      expect(result).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toPaginationResponseDTO', () => {
    it('should convert PaginationResultVO to PaginationResponseDTO', () => {
      const paginationVO = {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
      } as PaginationResultVO;

      const result = PaginationMapper.toPaginationResponseDTO(paginationVO);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(50);
      expect(result.totalPages).toBe(5);
    });

    it('should preserve all pagination values', () => {
      const paginationVO = {
        page: 3,
        limit: 20,
        total: 100,
        totalPages: 5,
      } as PaginationResultVO;

      const result = PaginationMapper.toPaginationResponseDTO(paginationVO);

      expect(result.page).toBe(3);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(5);
    });

    it('should handle single page results', () => {
      const paginationVO = {
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
      } as PaginationResultVO;

      const result = PaginationMapper.toPaginationResponseDTO(paginationVO);

      expect(result.totalPages).toBe(1);
    });

    it('should handle zero results', () => {
      const paginationVO = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      } as PaginationResultVO;

      const result = PaginationMapper.toPaginationResponseDTO(paginationVO);

      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });
});
