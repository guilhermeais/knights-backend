import { DatabaseModule } from '@/infra/database/database.module';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { AppModule } from '@/main/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';
import request from 'supertest';

describe('Get Knight (E2E)', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    app.useGlobalFilters(new DefaultExceptionFilter());

    knightFactory = moduleRef.get(KnightFactory);

    await app.init();
  });

  describe('[GET] /knights/:id', () => {
    it('should return the specific knight', async () => {
      const aKnight = await knightFactory.createMongoKnight({
        name: 'Mr. Knight',
      });
      await knightFactory.createMongoKnight({
        name: 'Mr. Another Knight',
      });

      const response = await request(app.getHttpServer()).get(
        `/knights/${aKnight.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        age: aKnight.getAge(),
        attack: aKnight.attack,
        attributes: aKnight.attributes,
        birthday: aKnight.birthday.toISOString(),
        weapons: aKnight.weapons,
        experience: aKnight.experience,
        id: aKnight.id,
        keyAttribute: aKnight.keyAttribute,
        name: aKnight.name,
        nickname: aKnight.nickname,
        type: aKnight.type,
      });
    });

    it('should return 404 if specific knight does not exists', async () => {
      const id = faker.string.uuid();

      const response = await request(app.getHttpServer()).get(`/knights/${id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'NotFoundError',
        message: [`Knight com id: ${id} não encontrado.`],
        statusCode: 404,
      });
    });
  });
});
