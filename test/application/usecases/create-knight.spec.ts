import { Logger } from '@/application/protocols/gateways/logger.interface';
import {
  CreateKnight,
  CreateKnightRequest,
} from '@/application/usecases/create-knight';
import { MockProxy, mock } from 'jest-mock-extended';

import { faker } from '@faker-js/faker';
import { KnightInMemoryRepository } from '@test/mocks/applications/protocols/repositories/knight.in-memory-repository';
import { KnightAttributesEnum, KnightType } from '@/domain/entities/knight';

describe('CreateKnight UseCase', () => {
  let sut: CreateKnight;
  let knightRepository: KnightInMemoryRepository;
  let logger: MockProxy<Logger>;

  beforeEach(() => {
    knightRepository = new KnightInMemoryRepository();
    logger = mock();

    sut = new CreateKnight(knightRepository, logger);
  });

  function makeCreateKnightParams(
    modifications?: Partial<CreateKnightRequest>,
  ): CreateKnightRequest {
    return {
      name: faker.person.fullName(),
      nickname: faker.person.firstName(),
      birthday: faker.date.past({
        years: 18,
      }),
      attributes: {
        strength: faker.number.int(),
        dexterity: faker.number.int(),
        constitution: faker.number.int(),
        intelligence: faker.number.int(),
        wisdom: faker.number.int(),
        charisma: faker.number.int(),
      },
      keyAttribute: KnightAttributesEnum.STRENGTH,
      weapons: [],
      type: KnightType.HERO,
      ...modifications,
    };
  }

  it('should create a valid knight', async () => {
    const knight = await sut.execute(makeCreateKnightParams());

    expect(knightRepository.count).toBe(1);

    const createdKnight = await knightRepository.get(knight.id);

    expect(knight.id).toEqual(createdKnight.id);
    expect(knight.name).toEqual(createdKnight.name);
  });
});
