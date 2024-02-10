import { CreateKnight } from '@/application/usecases/create-knight';
import { UpdateKnight } from '@/application/usecases/update-knight';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { CreateKnightController } from './controllers/create-knight.controller';
import { UpdateKnightController } from './controllers/update-knight.controller';

@Module({
  imports: [DatabaseModule, GatewaysModule],
  controllers: [CreateKnightController, UpdateKnightController],
  providers: [CreateKnight, UpdateKnight],
})
export class HttpModule {}
