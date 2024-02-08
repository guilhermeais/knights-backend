import { Logger } from '@/application/protocols/gateways/logger.interface';
import { MockProxy, mock } from 'jest-mock-extended';

import { KnightDTO } from '@/application/protocols/dao/knight.dao';
import { GetKnight, GetKnightRequest } from '@/application/usecases/get-knight';
import { KnightType } from '@/domain/entities/knight';
import { faker } from '@faker-js/faker';
import {
  KnightInMemoryDAO,
  makeKnightDaoModel,
} from '@test/mocks/applications/protocols/dao/knight.in-memory-dao';
import { NotFoundError } from '@/domain/errors/not-found.error';

describe('GetKnight UseCase', () => {
  let sut: GetKnight;
  let knightDAO: KnightInMemoryDAO;
  let logger: MockProxy<Logger>;

  const mockedKnights: KnightDTO[] = [
    makeKnightDaoModel({
      id: 'valid_id',
      type: KnightType.HERO,
    }),
    makeKnightDaoModel({
      id: 'other_valid_id',
      type: KnightType.VILLAIN,
    }),
  ];

  beforeEach(() => {
    knightDAO = new KnightInMemoryDAO(mockedKnights);
    logger = mock();

    sut = new GetKnight(knightDAO, logger);
  });

  function makeGetKnightParams(
    modifications?: Partial<GetKnightRequest>,
  ): GetKnightRequest {
    return modifications ?? faker.string.uuid();
  }

  it('should return an existing knight', async () => {
    const knight = await sut.execute(makeGetKnightParams('valid_id'));
    const otherKnight = await sut.execute(
      makeGetKnightParams('other_valid_id'),
    );

    expect(knight).toEqual(mockedKnights[0]);
    expect(otherKnight).toEqual(mockedKnights[1]);
  });

  it('should throw if the id is invalid', async () => {
    const invalidId = 'invalid_id';
    await expect(sut.execute(makeGetKnightParams(invalidId))).rejects.toThrow(
      new NotFoundError('Knight', invalidId),
    );
  });
});
