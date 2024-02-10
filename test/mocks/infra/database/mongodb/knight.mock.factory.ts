import { KnightProps } from '@/domain/entities/knight';
import { MongoDbKnightMapper } from '@/infra/database/mongodb/mappers/mongodb-knight.mapper';
import {
  KnightModel,
  KnightSchema,
} from '@/infra/database/mongodb/schemas/knight.schema';
import { MONGOOSE_CONNECTION_NAME } from '@/infra/database/mongodb/utils/mongoose.connection.factory';
import { Inject, Injectable } from '@nestjs/common';
import { makeKnight } from '@test/mocks/domain/entities/knight.mock';
import { Model, Mongoose } from 'mongoose';

@Injectable()
export class KnightFactory {
  #knightsModel: Model<KnightModel>;

  constructor(
    @Inject(MONGOOSE_CONNECTION_NAME)
    private readonly mongoose: Mongoose,
  ) {
    this.#knightsModel = this.mongoose.model<KnightModel>(
      KnightModel.modelName,
      KnightSchema,
    );
  }

  async createMongoKnight(modifications?: Partial<KnightProps>) {
    const knight = makeKnight(modifications);

    await this.#knightsModel.create(MongoDbKnightMapper.toMongoDb(knight));

    return knight;
  }
}
