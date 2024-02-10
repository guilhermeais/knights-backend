import { DatabaseModule } from '@/infra/database/database.module';
import { AppModule } from '@/main/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('MongoDBKnightsRepository', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  }, 100000);

  it('should ', async () => {});
});
