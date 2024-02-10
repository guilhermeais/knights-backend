import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import { AppModule } from '@/main/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  makeKnight,
  makeWeapon,
} from '@test/mocks/domain/entities/knight.mock';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';

describe('MongoDBKnightsRepository', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;
  let sut: KnightRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    knightFactory = moduleRef.get(KnightFactory);
    sut = moduleRef.get(KnightRepository);

    await app.init();
  }, 100000);

  describe('get()', () => {
    it('should get an existing knight', async () => {
      const existingKnight = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
      });

      const response = await sut.get(existingKnight.id);

      expect(response).toEqual(existingKnight);
    });

    it('should return null if not found the knight', async () => {
      const response = await sut.get(faker.string.uuid());

      expect(response).toBeNull();
    });
  });

  describe('create()', () => {
    it('should create a knight', async () => {
      const knight = makeKnight({
        weapons: [makeWeapon()],
      });

      const response = await sut.create(knight);

      expect(response).toEqual(knight);
      expect(response.weapons).toEqual(knight.weapons);
    });
  });

  describe('update()', () => {
    it('should update a existing knight', async () => {
      const existingKnight = await knightFactory.createMongoKnight();

      existingKnight.setWeapons([makeWeapon()]);
      existingKnight.nickname = 'new nickname';

      await sut.update(existingKnight);

      const response = await sut.get(existingKnight.id);

      expect(response).toEqual(existingKnight);
      expect(response.weapons).toEqual(existingKnight.weapons);
      expect(response.nickname).toEqual(existingKnight.nickname);
    });
  });

  describe('softDelete()', () => {
    it('should soft delete the knight', async () => {
      const existingKnight = await knightFactory.createMongoKnight();

      await sut.softDelete(existingKnight.id);

      const response = await sut.get(existingKnight.id);

      expect(response).toBeNull();
    });
  });
});
