import { randomUUID } from 'crypto';

export class UUID {
  static generate(): string {
    return randomUUID();
  }
}
