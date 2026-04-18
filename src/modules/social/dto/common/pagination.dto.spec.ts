import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationRequestDTO } from './pagination.dto';

describe('PaginationRequestDTO', () => {
  it('should validate with valid page and limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with missing page', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should fail validation with missing limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail validation with page = 0', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 0,
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should fail validation with limit = 0', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: 0,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
  });

  it('should fail validation with negative page', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: -1,
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with negative limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: -5,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with non-integer page', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1.5,
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with non-integer limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: 10.7,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with string page', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: '1',
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with string limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: '10',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with null page', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: null,
      limit: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with null limit', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: null,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate with large valid values', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1000,
      limit: 500,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with minimum valid values', async () => {
    const dto = plainToInstance(PaginationRequestDTO, {
      page: 1,
      limit: 1,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
