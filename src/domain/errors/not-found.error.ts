import { BaseError } from '@/shared/errors/base-error';

export class NotFoundError extends BaseError {
  constructor(entity: string, id: string) {
    super({
      message: `${entity} com id: ${id} não encontrado.`,
      code: 404,
    });
  }
}
