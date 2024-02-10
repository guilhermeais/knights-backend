// import { Logger } from '@/application/protocols/gateways/logger.interface';

import { Logger } from '@/application/protocols/gateways/logger.interface';
import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class NestLoggerAdapter implements Logger {
  info(ctx: string, message: string): void {
    NestLogger.log(message, ctx);
  }

  error(ctx: string, message: string): void {
    NestLogger.error(message, ctx);
  }

  warn(ctx: string, message: string): void {
    NestLogger.warn(message, ctx);
  }

  debug(ctx: string, message: string): void {
    NestLogger.debug(message, ctx);
  }
}
