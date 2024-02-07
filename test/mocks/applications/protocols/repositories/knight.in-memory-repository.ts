import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Knight } from '@/domain/entities/knight';

export class KnightInMemoryRepository implements KnightRepository {
  knights: Knight[] = [];

  async create(knight: Knight): Promise<Knight> {
    this.knights.push(knight);
    return knight;
  }
}
