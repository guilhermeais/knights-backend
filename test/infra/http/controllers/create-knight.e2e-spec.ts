import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import { AppModule } from '@/main/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';
import { makeCreateKnightDto } from '@test/mocks/infra/http/dto/create-knight.dto.mock';
import request from 'supertest';

describe('Create a Knight (E2E)', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;
  let knightRepository: KnightRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    knightFactory = moduleRef.get(KnightFactory);
    knightRepository = moduleRef.get(KnightRepository);

    await app.init();
  });

  describe('[POST] /knights', () => {
    it('should create a valid knight', async () => {
      const createKnightData = makeCreateKnightDto();

      const response = await request(app.getHttpServer())
        .post('/knights')
        .send(createKnightData);

      expect(response.status).toBe(201);

      const createdKnight = response.body;

      expect(createdKnight).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: createdKnight.name,
          nickname: createdKnight.nickname,
          birthday: createdKnight.birthday,
          attributes: createdKnight.attributes,
          weapons: createdKnight.weapons,
          keyAttribute: createdKnight.keyAttribute,
          type: createdKnight.type,
          age: createdKnight.age,
          experience: createdKnight.experience,
          attack: createdKnight.attack,
        }),
      );

      const knightDb = await knightRepository.get(createdKnight.id);

      expect(knightDb).toBeDefined();
    });
  });
});
