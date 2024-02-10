import { DatabaseModule } from '@/infra/database/database.module';
import { envSchema } from '@/infra/env/env';
import { EnvModule } from '@/infra/env/env.module';
import { GatewaysModule } from '@/infra/gateways/gateways.module';
import { HttpModule } from '@/infra/http/http.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    GatewaysModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
