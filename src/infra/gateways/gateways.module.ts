import { Logger } from '@/application/protocols/gateways/logger.interface';
import { Module } from '@nestjs/common';
import { NestLoggerAdapter } from './logger/nest-logger.adapter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: Logger,
      useClass: NestLoggerAdapter,
    },
  ],
  exports: [Logger],
})
export class GatewaysModule {}
