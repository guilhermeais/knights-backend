import { KnightType } from '@/domain/entities/knight';
import { DatabaseModule } from '@/infra/database/database.module';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { AppModule } from '@/main/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';
import request from 'supertest';

describe('Get all Knights (E2E)', () => {
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

  describe('[GET] /knights', () => {
    it('should return all knights paginated', async () => {
      await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
          knightFactory.createMongoKnight(
            {
              name: `Knight - ${i + 1}`,
            },
            new Date(2021, 0, 1, 10, i),
          ),
        ),
      );

      const firstPage = await request(app.getHttpServer()).get(
        '/knights?limit=5',
      );

      expect(firstPage.status).toBe(200);
      expect(firstPage.body.data.length).toBe(5);
      expect(firstPage.body.total).toBe(10);
      expect(firstPage.body.totalPages).toBe(2);
      expect(firstPage.body.nextPage).toBe(2);

      const secondPage = await request(app.getHttpServer()).get(
        `/knights?limit=5&page=${firstPage.body.nextPage}`,
      );

      expect(secondPage.status).toBe(200);
      expect(secondPage.body.data.length).toBe(5);
      expect(secondPage.body.total).toBe(10);
      expect(secondPage.body.totalPages).toBe(2);
      expect(secondPage.body.nextPage).toBe(null);
    });

    it('should return empty if there is no knight', async () => {
      const response = await request(app.getHttpServer()).get('/knights');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.total).toBe(0);
      expect(response.body.totalPages).toBe(0);
      expect(response.body.nextPage).toBe(null);
    });

    it('should return only heroes', async () => {
      await Promise.all([
        ...Array.from({ length: 10 }).map((_, i) =>
          knightFactory.createMongoKnight(
            {
              name: `Knight - ${i + 1}`,
              type: KnightType.HERO,
            },
            new Date(2021, 0, 1, 10, i),
          ),
        ),
        ...Array.from({ length: 10 }).map((_, i) =>
          knightFactory.createMongoKnight(
            {
              name: `Knight - ${i + 1}`,
              type: KnightType.VILLAIN,
            },
            new Date(2021, 0, 1, 10, i),
          ),
        ),
      ]);

      const response = await request(app.getHttpServer()).get(
        '/knights?type=hero&limit=5',
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.total).toBe(10);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.nextPage).toBe(2);

      expect(
        response.body.data.every((knight) => knight.type === KnightType.HERO),
      ).toBe(true);
    });

    it('should return only villains', async () => {
      await Promise.all([
        ...Array.from({ length: 10 }).map((_, i) =>
          knightFactory.createMongoKnight(
            {
              name: `Knight - ${i + 1}`,
              type: KnightType.HERO,
            },
            new Date(2021, 0, 1, 10, i),
          ),
        ),
        ...Array.from({ length: 10 }).map((_, i) =>
          knightFactory.createMongoKnight(
            {
              name: `Knight - ${i + 1}`,
              type: KnightType.VILLAIN,
            },
            new Date(2021, 0, 1, 10, i),
          ),
        ),
      ]);

      const response = await request(app.getHttpServer()).get(
        '/knights?type=villain&limit=5',
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.total).toBe(10);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.nextPage).toBe(2);

      expect(
        response.body.data.every(
          (knight) => knight.type === KnightType.VILLAIN,
        ),
      ).toBe(true);
    });
  });
});
