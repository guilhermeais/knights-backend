import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import {
  KnightModel,
  KnightModelProvider,
} from '@/infra/database/mongodb/schemas/knight.schema';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { AppModule } from '@/main/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';
import { Model } from 'mongoose';
import request from 'supertest';

describe('Delete Knight (E2E)', () => {
  let app: INestApplication;
  let knightFactory: KnightFactory;
  let knightRepository: KnightRepository;
  let knightModel: Model<KnightModel>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [KnightFactory, KnightModelProvider],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    app.useGlobalFilters(new DefaultExceptionFilter());

    knightFactory = moduleRef.get(KnightFactory);
    knightRepository = moduleRef.get(KnightRepository);
    knightModel = moduleRef.get(KnightModel.name);

    await app.init();
  });

  describe('[DELETE] /knights/:id', () => {
    it('should dele the specific knight', async () => {
      const aKnight = await knightFactory.createMongoKnight({
        name: 'Mr. Knight',
      });

      const response = await request(app.getHttpServer()).delete(
        `/knights/${aKnight.id}`,
      );

      expect(response.status).toBe(200);

      const deletedKnight = await knightRepository.get(aKnight.id);

      expect(deletedKnight).toBeNull();

      const knight = await knightModel.findById(aKnight.id);

      expect(knight.deletedAt).toBeDefined();
    });
  });
});
