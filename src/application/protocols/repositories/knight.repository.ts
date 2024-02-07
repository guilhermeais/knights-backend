import { Knight } from '@/domain/entities/knight';

export abstract class KnightRepository {
  abstract create(knight: Knight): Promise<Knight>;
}
