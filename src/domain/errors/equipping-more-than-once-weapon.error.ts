import { BaseError } from '@/shared/errors/base-error';

export class EquippingMoreThanOnceWeaponError extends BaseError {
  constructor() {
    super({
      message: 'Um Knight não pode equipar mais de uma arma ao mesmo tempo.',
      code: 400,
    });
  }
}
