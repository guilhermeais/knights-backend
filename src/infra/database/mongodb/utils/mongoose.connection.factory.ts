import { EnvService } from '@/infra/env/env.service';
import { FactoryProvider } from '@nestjs/common';
import mongoose from 'mongoose';

export const MONGOOSE_CONNECTION_NAME = 'MONGOOSE_CONNECTION' as const;

export const MongooseConnectionFactory: FactoryProvider = {
  inject: [EnvService],
  async useFactory(envService: EnvService): Promise<typeof mongoose> {
    console.log('⏳ Connecting to MongoDB...');
    const uri = envService.get('MONGO_URL');
    const appName = 'knights';
    const dbName = 'knights-db';
    console.log(
      `🔗 Connecting to MongoDB at ${uri} using appName: ${appName} and dbName: ${dbName}...`,
    );
    const connection = await mongoose.connect(uri, {
      dbName,
      appName,
    });

    console.log('🚀 MongoDB connected');

    return connection;
  },
  provide: MONGOOSE_CONNECTION_NAME,
};
