import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { MongoDBKnightsRepository } from './mongodb/repositores/mongodb-knights.repository';
import { MongooseConnectionFactory } from './mongodb/utils/mongoose.connection.factory';
import { KnightModelProvider } from './mongodb/schemas/knight.schema';

@Module({
  imports: [EnvModule],
  providers: [
    MongooseConnectionFactory,
    KnightModelProvider,
    {
      provide: KnightRepository,
      useClass: MongoDBKnightsRepository,
    },
  ],
  exports: [MongooseConnectionFactory, KnightRepository],
})
export class DatabaseModule {}
