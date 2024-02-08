import { Logger } from '@/application/protocols/gateways/logger.interface';
import {
  GetAllKnights,
  GetAllKnightsRequest,
} from '@/application/usecases/get-all-knights';
import { MockProxy, mock } from 'jest-mock-extended';

import { KnightDAOModel } from '@/application/protocols/dao/knight.dao';
import { KnightType } from '@/domain/entities/knight';
import {
  KnightInMemoryDAO,
  makeKnightDaoModel,
} from '@test/mocks/applications/protocols/dao/knight.in-memory-dao';

describe('GetAllKnights UseCase', () => {
  let sut: GetAllKnights;
  let knightDAO: KnightInMemoryDAO;
  let logger: MockProxy<Logger>;

  const mockedKnights: KnightDAOModel[] = [
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
      ...modifications,
    };
  }

  it('should get all knights', async () => {
    const knights = await sut.execute(makeGetAllKnightsParams());

    expect(knights).toHaveLength(2);
  });

  it('should get all heroes', async () => {
    const knights = await sut.execute(
      makeGetAllKnightsParams({ type: KnightType.HERO }),
    );

    expect(knights).toHaveLength(1);
    expect(knights[0].type).toEqual(KnightType.HERO);
  });

  it('should get all villains', async () => {
    const knights = await sut.execute(
      makeGetAllKnightsParams({ type: KnightType.VILLAIN }),
    );

    expect(knights).toHaveLength(1);
    expect(knights[0].type).toEqual(KnightType.VILLAIN);
  });
});
