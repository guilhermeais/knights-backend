import { BaseError } from '@/shared/errors/base-error';

export class EquippingMoreThanOnceWeaponError extends BaseError {
  constructor() {
    super({
      message: 'Um Knight não pode equipar a mesma arma mais de uma vez.',
      code: 400,
    });
  }
}
