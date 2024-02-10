import {
  KnightDAO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { DatabaseModule } from '@/infra/database/database.module';
import { AppModule } from '@/main/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeWeapon } from '@test/mocks/domain/entities/knight.mock';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';

describe('MongoDBKnightsDAO', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;
  let sut: KnightDAO;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    knightFactory = moduleRef.get(KnightFactory);
    sut = moduleRef.get(KnightDAO);

    await app.init();
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
        }),
      );

      expect(response.length).toEqual(expectedKnights.length);
      expect(response).toEqual(expectedKnights);
    });
  });
});
