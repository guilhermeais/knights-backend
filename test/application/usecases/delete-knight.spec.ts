import { Logger } from '@/application/protocols/gateways/logger.interface';
import { DeleteKnight } from '@/application/usecases/delete-knight';
import { KnightInMemoryRepository } from '@test/mocks/applications/protocols/repositories/knight.in-memory-repository';
import { makeKnight } from '@test/mocks/domain/entities/knight.mock';
import { MockProxy, mock } from 'jest-mock-extended';

describe('DeleteKnight', () => {
  let sut: DeleteKnight;
  let knightRepository: KnightInMemoryRepository;
  let logger: MockProxy<Logger>;

  beforeEach(() => {
    knightRepository = new KnightInMemoryRepository();
    logger = mock<Logger>();

    sut = new DeleteKnight(knightRepository, logger);
  });

  it('should delete a existing knight', async () => {
    const knight = await knightRepository.create(makeKnight());
    expect(knightRepository.count).toBe(1);

    await sut.execute({ id: knight.id });

    expect(knightRepository.count).toBe(0);
    expect(knightRepository.deletedKnights.get(knight.id)).toEqual(knight);
  });
});
