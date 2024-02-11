import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import { UpdateKnightDto } from '@/infra/http/dto/update-knight.dto';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { AppModule } from '@/main/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KnightFactory } from '@test/mocks/infra/database/mongodb/knight.mock.factory';
import { makeKnightWeaponDto } from '@test/mocks/infra/http/dto/create-knight.dto.mock';
import { makeUpdateKnightDto } from '@test/mocks/infra/http/dto/update-knight.dto.mock';
import request from 'supertest';

describe('Update a Knight (E2E)', () => {
  let app: INestApplication;
  let knightRepository: KnightRepository;
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
    knightRepository = moduleRef.get(KnightRepository);

    await app.init();
  });

  describe('[PATCH] /knights/:id', () => {
    it('should update an exiting knight', async () => {
      const knight = await knightFactory.createMongoKnight({
        nickname: 'Old Nickname',
        weapons: [],
      });

      const updateKnightDto = makeUpdateKnightDto({
        nickname: 'New Nickname',
        weapons: [
          makeKnightWeaponDto({
            equipped: true,
          }),
        ],
      });

      const response = await request(app.getHttpServer())
        .patch(`/knights/${knight.id}`)
        .send(updateKnightDto);

      expect(response.status).toBe(200);

      const updatedKnight = await knightRepository.get(knight.id);

      expect(updatedKnight).toEqual(
        expect.objectContaining({
          id: knight.id,
          name: knight.name,
          nickname: 'New Nickname',
          birthday: knight.birthday,
          weapons: updateKnightDto.weapons,
        }),
      );
    });

    it('should return 404 if knight does not exist', async () => {
      const updateKnightDto = makeUpdateKnightDto();
      const invalidId = faker.string.uuid();
      const response = await request(app.getHttpServer())
        .patch(`/knights/${invalidId}`)
        .send(updateKnightDto);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        message: [`Knight com id: ${invalidId} não encontrado.`],
        error: 'NotFoundError',
      });
    });

    it('should return 400 if knight equip two weapons', async () => {
      const knight = await knightFactory.createMongoKnight({
        nickname: 'Old Nickname',
        weapons: [],
      });

      const updateKnightDto = makeUpdateKnightDto({
        weapons: [
          makeKnightWeaponDto({
            equipped: true,
          }),
          makeKnightWeaponDto({
            equipped: true,
          }),
        ],
      });

      const response = await request(app.getHttpServer())
        .patch(`/knights/${knight.id}`)
        .send(updateKnightDto);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'Um Knight não pode equipar mais de uma arma ao mesmo tempo.',
        ],
        error: 'EquippingMoreThanOnceWeaponError',
      });
    });

    describe('Exceptions', () => {
      it.each([
        {
          body: makeUpdateKnightDto({
            nickname: null,
          }),
          expectedStatusCode: 400,
          expectedResponse: {
            statusCode: 400,
            message: ['Apelido inválido.'],
            error: 'Bad Request',
          },
        },
        {
          body: makeUpdateKnightDto({
            weapons: 'sdfgsf' as any,
          }),
          expectedStatusCode: 400,
          expectedResponse: {
            statusCode: 400,
            message: ['Armas do guerreiro inválida(s).'],
            error: 'Bad Request',
          },
        },
        {
          body: makeUpdateKnightDto({
            weapons: [
              makeKnightWeaponDto({
                mod: 'sdfgsf' as any,
              }),
            ],
          }),
          expectedStatusCode: 400,
          expectedResponse: {
            statusCode: 400,
            message: ['weapons.0.mod: Modificador de dano da arma inválido.'],
            error: 'Bad Request',
          },
        },
      ] as {
        body: UpdateKnightDto;
        expectedStatusCode: number;
        expectedResponse: any;
      }[])(
        'should return $expectedStatusCode if body is $body',
        async ({ body, expectedResponse, expectedStatusCode }) => {
          const knight = await knightFactory.createMongoKnight({
            nickname: 'Old Nickname',
            weapons: [],
          });

          const response = await request(app.getHttpServer())
            .patch(`/knights/${knight.id}`)
            .send(body);

          expect(response.status).toBe(expectedStatusCode);
          expect(response.body).toEqual(expectedResponse);
        },
      );
    });
  });
});
