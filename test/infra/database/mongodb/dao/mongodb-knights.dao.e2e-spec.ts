import {
  KnightDAO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { KnightType } from '@/domain/entities/knight';
import { DatabaseModule } from '@/infra/database/database.module';
import { AppModule } from '@/main/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeWeapon } from '@test/mocks/domain/entities/knight.mock';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';

describe('MongoDBKnightsDAO', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;
  let sut: KnightDAO;

  beforeAll(async () => {
    vi.useFakeTimers();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    knightFactory = moduleRef.get(KnightFactory);
    sut = moduleRef.get(KnightDAO);

    await app.init();
  });

  afterAll(async () => {
    vi.useRealTimers();
    await app.close();
  });

  describe('getAll()', () => {
    it('should get all knights with a simple data structure', async () => {
      const aKnight = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
      });

      const anotherKnight = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
      });

      const response = await sut.getAll();

      const expectedKnights = [aKnight, anotherKnight].map<SimpleKnightDTO>(
        (knight) => ({
          age: knight.getAge(),
          attack: knight.attack,
          experience: knight.experience,
          id: knight.id,
          keyAttribute: knight.keyAttribute,
          name: knight.name,
          nickname: knight.nickname,
          type: knight.type,
          weaponsQuantity: knight.weapons.length,
          createdAt: knight.createdAt,
          updatedAt: expect.any(Date),
        }),
      );

      expect(response.data.length).toEqual(expectedKnights.length);
      expect(response.data).toEqual(expectedKnights);
    });

    it('should return empty array if knights does not exists', async () => {
      const response = await sut.getAll();

      const expectedKnights = [];

      expect(response.data.length).toEqual(expectedKnights.length);
      expect(response.data).toEqual(expectedKnights);
    });

    it('should get all knights heroes with a simple data structure', async () => {
      const aKnightHero = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.HERO,
      });

      const anotherKnightHero = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.HERO,
      });

      await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.VILLAIN,
      });

      const response = await sut.getAll({
        type: KnightType.HERO,
      });

      const expectedKnights = [
        aKnightHero,
        anotherKnightHero,
      ].map<SimpleKnightDTO>((knight) => ({
        age: knight.getAge(),
        attack: knight.attack,
        experience: knight.experience,
        id: knight.id,
        keyAttribute: knight.keyAttribute,
        name: knight.name,
        nickname: knight.nickname,
        type: knight.type,
        weaponsQuantity: knight.weapons.length,
        createdAt: knight.createdAt,
        updatedAt: expect.any(Date),
      }));

      expect(response.data.length).toEqual(expectedKnights.length);
      expect(response.data).toEqual(expectedKnights);
    });

    it('should get all knights villains with a simple data structure', async () => {
      const aVillain = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.VILLAIN,
      });

      const anotherVillain = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.VILLAIN,
      });

      await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
        type: KnightType.HERO,
      });

      const response = await sut.getAll({
        type: KnightType.VILLAIN,
      });

      const expectedKnights = [aVillain, anotherVillain].map<SimpleKnightDTO>(
        (knight) => ({
          age: knight.getAge(),
          attack: knight.attack,
          experience: knight.experience,
          id: knight.id,
          keyAttribute: knight.keyAttribute,
          name: knight.name,
          nickname: knight.nickname,
          type: knight.type,
          weaponsQuantity: knight.weapons.length,
          createdAt: knight.createdAt,
          updatedAt: expect.any(Date),
        }),
      );

      expect(response.data.length).toEqual(expectedKnights.length);
      expect(response.data).toEqual(expectedKnights);
    });

    it('should correctly paginate the knights', async () => {
      await Promise.all(
        Array.from({ length: 10 }).map(async (_, index) => {
          await knightFactory.createMongoKnight(
            {
              name: `Knight ${index + 1}`,
              weapons: [makeWeapon()],
            },
            new Date(2021, 1, 1, index + 1),
          );
        }),
      );

      const firstPage = await sut.getAll({ limit: 5, page: 1 });

      expect(firstPage.data.length).toEqual(5);
      expect(firstPage.total).toEqual(10);
      expect(firstPage.totalPages).toEqual(2);
      expect(firstPage.nextPage).toEqual(2);

      expect(firstPage.data.at(0).name).toEqual('Knight 1');
      expect(firstPage.data.at(-1).name).toEqual('Knight 5');

      const secondPage = await sut.getAll({ limit: 5, page: 2 });

      expect(secondPage.data.length).toEqual(5);
      expect(secondPage.total).toEqual(10);
      expect(secondPage.totalPages).toEqual(2);
      expect(secondPage.nextPage).toBeNull();

      expect(secondPage.data.at(0).name).toEqual('Knight 6');
      expect(secondPage.data.at(-1).name).toEqual('Knight 10');
    });
  });

  describe('getById()', () => {
    it('should return the knight with a detailed data structure', async () => {
      const aKnight = await knightFactory.createMongoKnight({
        weapons: [makeWeapon()],
      });

      const response = await sut.getById(aKnight.id);

      expect(response.id).toEqual(aKnight.id);
      expect(response.age).toEqual(aKnight.getAge());
      expect(response.attack).toEqual(aKnight.attack);
      expect(response.experience).toEqual(aKnight.experience);
      expect(response.nickname).toEqual(aKnight.nickname);
      expect(response.weapons).toEqual(aKnight.weapons);
      expect(response.type).toEqual(aKnight.type);
    });

    it('should return null if does not exists', async () => {
      const id = faker.string.uuid();

      const response = await sut.getById(id);

      expect(response).toBeNull();
    });
  });
});
