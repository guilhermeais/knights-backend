import { Knight } from '@/domain/entities/knight';

export abstract class KnightRepository {
  abstract get(id: string): Promise<Knight>;
  abstract create(knight: Knight): Promise<Knight>;
  abstract update(knight: Knight): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
}
