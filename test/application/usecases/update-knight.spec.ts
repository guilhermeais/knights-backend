import { Logger } from '@/application/protocols/gateways/logger.interface';
import {
  UpdateKnight,
  UpdateKnightRequest,
} from '@/application/usecases/update-knight';
import { MockProxy, mock } from 'jest-mock-extended';

import { faker } from '@faker-js/faker';
import { KnightInMemoryRepository } from '@test/mocks/applications/protocols/repositories/knight.in-memory-repository';
import {
  makeKnight,
  makeWeapon,
} from '@test/mocks/domain/entities/knight.mock';
import { EquippingMoreThanOnceWeaponError } from '@/domain/errors/equipping-more-than-once-weapon.error';
import { NotFoundError } from '@/domain/errors/not-found.error';

describe('UpdateKnight UseCase', () => {
  let sut: UpdateKnight;
  let knightRepository: KnightInMemoryRepository;
  let logger: MockProxy<Logger>;

  beforeEach(() => {
    knightRepository = new KnightInMemoryRepository();
    logger = mock();

    sut = new UpdateKnight(knightRepository, logger);
  });

  function makeUpdateKnightParams(
    modifications?: Partial<UpdateKnightRequest>,
  ): UpdateKnightRequest {
    return {
      id: faker.string.uuid(),
      nickname: faker.person.firstName(),
      weapons: [],
      ...modifications,
    };
  }

  it('should update a valid knight', async () => {
    const exitingKnight = makeKnight({
      nickname: 'Guizin',
    });

    await knightRepository.create(exitingKnight);

    await sut.execute(
      makeUpdateKnightParams({
        id: exitingKnight.id,
        nickname: 'Guizao',
        weapons: [
          makeWeapon({
            equipped: true,
          }),
        ],
      }),
    );

    const updatedKnight = await knightRepository.get(exitingKnight.id);

    expect(updatedKnight.nickname).toBe('Guizao');
  });

  it('should throw EquippingMoreThanOnceWeaponError if a knight try to equip more than once weapon', async () => {
    const exitingKnight = makeKnight({
      nickname: 'Guizin',
    });

    await knightRepository.create(exitingKnight);

    await expect(
      sut.execute(
        makeUpdateKnightParams({
          id: exitingKnight.id,
          nickname: 'Guizao',
          weapons: [
            makeWeapon({
              equipped: true,
            }),
            makeWeapon({
              equipped: true,
            }),
          ],
        }),
      ),
    ).rejects.toThrow(new EquippingMoreThanOnceWeaponError());

    const updatedKnight = await knightRepository.get(exitingKnight.id);

    expect(updatedKnight.nickname).toBe('Guizin');
    expect(updatedKnight.weapons).toEqual([]);
  });

  it('should throw NotFoundEntity try to update a knight that does not exists', async () => {
    const unexistingId = faker.string.uuid();
    await expect(
      sut.execute(
        makeUpdateKnightParams({
          id: unexistingId,
          nickname: 'Guizao',
          weapons: [
            makeWeapon({
              equipped: true,
            }),
            makeWeapon({
              equipped: true,
            }),
          ],
        }),
      ),
    ).rejects.toThrow(new NotFoundError('Knight', unexistingId));
  });
});
