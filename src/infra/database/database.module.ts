import { env } from '@/main/config/env';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightModel, KnightSchema } from './mongodb/schemas/knight.schema';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_URL, {
      appName: 'knights-database',
    }),
    MongooseModule.forFeature([
      {
        name: KnightModel.modelName,
        schema: KnightSchema,
      },
    ]),
  ],
})
export class DatabaseModule {}
