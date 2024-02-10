import { Module } from '@nestjs/common';
import { CreateKnightController } from './controllers/create-knight.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateKnight } from '@/application/usecases/create-knight';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [DatabaseModule, GatewaysModule],
  controllers: [CreateKnightController],
  providers: [CreateKnight],
})
export class HttpModule {}
