import { Logger } from '@/application/protocols/gateways/logger.interface';
import {
  GetAllKnights,
  GetAllKnightsRequest,
} from '@/application/usecases/get-all-knights';
import { MockProxy, mock } from 'vitest-mock-extended';

import { KnightDTO } from '@/application/protocols/dao/knight.dao';
import { KnightType } from '@/domain/entities/knight';
import {
  KnightInMemoryDAO,
  makeKnightDaoModel,
} from '@test/mocks/applications/protocols/dao/knight.in-memory-dao';

describe('GetAllKnights UseCase', () => {
  let sut: GetAllKnights;
  let knightDAO: KnightInMemoryDAO;
  let logger: MockProxy<Logger>;

  const mockedKnights: KnightDTO[] = [
    makeKnightDaoModel({
      type: KnightType.HERO,
    }),
    makeKnightDaoModel({
      type: KnightType.VILLAIN,
    }),
  ];

  beforeEach(() => {
    knightDAO = new KnightInMemoryDAO(mockedKnights);
    logger = mock();

    sut = new GetAllKnights(knightDAO, logger);
  });

  function makeGetAllKnightsParams(
    modifications?: Partial<GetAllKnightsRequest>,
  ): GetAllKnightsRequest {
    return {
      type: null,
      limit: 10,
      page: 1,
      ...modifications,
    };
  }

  it('should get all knights', async () => {
    const result = await sut.execute(makeGetAllKnightsParams());

    expect(result.data).toHaveLength(2);
  });

  it('should get all knights paginated', async () => {
    const result = await sut.execute(
      makeGetAllKnightsParams({
        limit: 1,
      }),
    );

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.nextPage).toBe(2);
    expect(result.page).toBe(1);

    const secondPageResult = await sut.execute(
      makeGetAllKnightsParams({
        limit: 1,
        page: 2,
      }),
    );

    expect(secondPageResult.data).toHaveLength(1);
    expect(secondPageResult.total).toBe(2);
    expect(secondPageResult.totalPages).toBe(2);
    expect(secondPageResult.nextPage).toBe(null);
    expect(secondPageResult.page).toBe(2);
  });

  it('should get all heroes', async () => {
    const result = await sut.execute(
      makeGetAllKnightsParams({ type: KnightType.HERO }),
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].type).toEqual(KnightType.HERO);
  });

  it('should get all villains', async () => {
    const result = await sut.execute(
      makeGetAllKnightsParams({ type: KnightType.VILLAIN }),
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].type).toEqual(KnightType.VILLAIN);
  });
});
