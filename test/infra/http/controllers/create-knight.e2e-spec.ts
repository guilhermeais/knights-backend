import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import { CreateKnightDto } from '@/infra/http/dto/create-knight.dto';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { AppModule } from '@/main/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  makeCreateKnightDto,
  makeKnightWeaponDto,
} from '@test/mocks/infra/http/dto/create-knight.dto.mock';
import { subYears } from 'date-fns';
import request from 'supertest';

describe('Create a Knight (E2E)', () => {
  let app: INestApplication;
  let knightRepository: KnightRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    app.useGlobalFilters(new DefaultExceptionFilter());

    knightRepository = moduleRef.get(KnightRepository);

    await app.init();
  });

  describe('[POST] /knights', () => {
    it('should create a valid knight', async () => {
      const eighteenYearsAgo = subYears(new Date(), 18);

      const createKnightData = makeCreateKnightDto({
        birthday: eighteenYearsAgo,
        weapons: [makeKnightWeaponDto()],
      });

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
          age: 18,
          experience: createdKnight.experience,
          attack: createdKnight.attack,
        }),
      );

      const knightDb = await knightRepository.get(createdKnight.id);

      expect(knightDb).toBeDefined();
      expect(knightDb.weapons).toEqual(createdKnight.weapons);
      expect(knightDb.attributes).toEqual(createdKnight.attributes);
    });

    it('should not equipe more than once weapon', async () => {
      const eighteenYearsAgo = subYears(new Date(), 18);

      const createKnightData = makeCreateKnightDto({
        birthday: eighteenYearsAgo,
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
        .post('/knights')
        .send(createKnightData);

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: ['Um Knight não pode equipar a mesma arma mais de uma vez.'],
        error: 'EquippingMoreThanOnceWeaponError',
      });
    });

    it.each([
      {
        body: makeCreateKnightDto({
          attributes: null,
        }),
        expectedResponse: expect.objectContaining({
          attributes: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
          },
        }),
        expectedStatus: 201,
      },
    ] as {
      body: CreateKnightDto;
      expectedStatus: number;
      expectedResponse: any;
    }[])(
      'should return $expectedStatus when creating a valid knight with body: $body',
      async ({ body, expectedResponse, expectedStatus }) => {
        const response = await request(app.getHttpServer())
          .post('/knights')
          .send(body);

        expect(response.status).toBe(expectedStatus);
        expect(response.body).toEqual(expectedResponse);
      },
    );

    describe('Exceptions', () => {
      it.each([
        {
          body: makeCreateKnightDto({
            name: undefined,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Nome inválido.'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            nickname: null,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Apelido inválido.'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            birthday: null,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Data de nascimento inválida.'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },

        {
          body: makeCreateKnightDto({
            birthday: 'asdfgafdg' as any,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Data de nascimento inválida.'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            attributes: 'asdfgafdg' as any,
          }),
          expectedResponse: {
            statusCode: 400,
            message: [
              'Atributos inválidos.',
              'Há algum propriedade inválida nos atributos do guerreiro.',
            ],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            attributes: {
              charisma: 'asdfgafdg' as any,
            },
          }),
          expectedResponse: {
            statusCode: 400,
            message: [
              'attributes.charisma: Atributo de carisma (charisma) inválido.',
            ],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            weapons: 'asdfgafdg' as any,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Armas do guerreiro inválida(s).'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            weapons: [
              makeKnightWeaponDto({
                attr: 'asdfgafdg' as any,
              }),
            ],
          }),
          expectedResponse: {
            statusCode: 400,
            message: [
              'weapons.0.attr: Atributo da arma inválido. Os valores válidos são: strength, dexterity, constitution, intelligence, wisdom, charisma',
            ],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            keyAttribute: 'asdfgafdg' as any,
          }),
          expectedResponse: {
            statusCode: 400,
            message: [
              'Atributo chave inválido. Os valores válidos são: strength, dexterity, constitution, intelligence, wisdom, charisma',
            ],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
        {
          body: makeCreateKnightDto({
            type: 'asdfgafdg' as any,
          }),
          expectedResponse: {
            statusCode: 400,
            message: ['Tipo inválido. Os valores válidos são: hero, villain'],
            error: 'Bad Request',
          },
          expectedStatus: 400,
        },
      ] as {
        body: CreateKnightDto;
        expectedStatus: number;
        expectedResponse: any;
      }[])(
        'should return $expectedStatus when creating a knight with body: $body',
        async ({ body, expectedResponse, expectedStatus }) => {
          const response = await request(app.getHttpServer())
            .post('/knights')
            .send(body);

          expect(response.body).toEqual(expectedResponse);
          expect(response.status).toBe(expectedStatus);
        },
      );
    });
  });
});
