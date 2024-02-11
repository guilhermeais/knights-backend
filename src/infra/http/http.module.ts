import { CreateKnight } from '@/application/usecases/create-knight';
import { DeleteKnight } from '@/application/usecases/delete-knight';
import { GetAllKnights } from '@/application/usecases/get-all-knights';
import { GetKnight } from '@/application/usecases/get-knight';
import { UpdateKnight } from '@/application/usecases/update-knight';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { CreateKnightController } from './controllers/create-knight.controller';
import { DeleteKnightController } from './controllers/delete-knight.controller';
import { GetAllKnightsController } from './controllers/get-all-knights.controller';
import { GetKnightController } from './controllers/get-knight.controller';
import { UpdateKnightController } from './controllers/update-knight.controller';

@Module({
  imports: [DatabaseModule, GatewaysModule],
  controllers: [
    CreateKnightController,
    UpdateKnightController,
    GetAllKnightsController,
    GetKnightController,
    DeleteKnightController,
  ],
  providers: [
    CreateKnight,
    UpdateKnight,
    GetAllKnights,
    GetKnight,
    DeleteKnight,
  ],
})
export class HttpModule {}
