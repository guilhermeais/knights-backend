import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Knight } from '@/domain/entities/knight';

export class MongoDBKnightsRepository implements KnightRepository {
  get(id: string): Promise<Knight> {
    throw new Error('Method not implemented.');
  }
  create(knight: Knight): Promise<Knight> {
    throw new Error('Method not implemented.');
  }
  update(knight: Knight): Promise<void> {
    throw new Error('Method not implemented.');
  }
  softDelete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
