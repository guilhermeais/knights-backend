import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Knight } from '@/domain/entities/knight';

export class KnightInMemoryRepository implements KnightRepository {
  constructor(initialKnights: Knight[] = []) {
    initialKnights.forEach((knight) => this.knights.set(knight.id, knight));
  }

  knights: Map<string, Knight> = new Map();

  async create(knight: Knight): Promise<Knight> {
    this.knights.set(knight.id, knight);
    return knight;
  }

  async get(id: string): Promise<Knight> {
    return this.knights.get(id);
  }

  async update(knight: Knight): Promise<void> {
    this.knights.set(knight.id, knight);
  }

  get count() {
    return this.knights.size;
  }
}
