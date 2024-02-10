import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { MongoDBKnightsRepository } from './mongodb/repositores/mongodb-knights.repository';
import { MongooseConnectionFactory } from './mongodb/utils/mongoose.connection.factory';
import { KnightModelProvider } from './mongodb/schemas/knight.schema';
import { KnightDAO } from '@/application/protocols/dao/knight.dao';
import { MongoDBKnightsDAO } from './mongodb/dao/mongodb-knights.dao';

@Module({
  imports: [EnvModule],
  providers: [
    MongooseConnectionFactory,
    KnightModelProvider,
    {
      provide: KnightRepository,
      useClass: MongoDBKnightsRepository,
    },
    {
      provide: KnightDAO,
      useClass: MongoDBKnightsDAO,
    },
  ],
  exports: [MongooseConnectionFactory, KnightRepository, KnightDAO],
})
export class DatabaseModule {}
