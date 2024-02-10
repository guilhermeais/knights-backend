import { Module } from '@nestjs/common';
import {
  MONGOOSE_CONNECTION_NAME,
  MongooseConnectionFactory,
} from './mongodb/utils/mongoose.connection.factory';
import { EnvModule } from '../env/env.module';
import { MongoDBKnightsRepository } from './mongodb/mongodb-knights.repository';
import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Mongoose } from 'mongoose';
import { KnightModel, KnightSchema } from './mongodb/schemas/knight.schema';

@Module({
  imports: [EnvModule],
  providers: [
    MongooseConnectionFactory,
    {
      provide: KnightRepository,
      inject: [MONGOOSE_CONNECTION_NAME],
      useFactory: (mongoose: Mongoose) =>
        new MongoDBKnightsRepository(
          mongoose.model(KnightModel.modelName, KnightSchema),
        ),
    },
  ],
})
export class DatabaseModule {}
