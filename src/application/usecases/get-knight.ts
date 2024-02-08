import { NotFoundError } from '@/domain/errors/not-found.error';
import { Injectable } from '@nestjs/common';
import { KnightDAO, KnightDTO } from '../protocols/dao/knight.dao';
import { Logger } from '../protocols/gateways/logger.interface';
import { UseCase } from '../protocols/usecase.interface';

export type GetKnightRequest = string;
export type GetKnightResponse = KnightDTO;

@Injectable()
export class GetKnight
  implements UseCase<GetKnightRequest, Promise<GetKnightResponse>>
{
  constructor(
    private readonly knightDAO: KnightDAO,
    private readonly logger: Logger,
  ) {}

  async execute(knightId: GetKnightRequest): Promise<GetKnightResponse> {
    this.logger.info(GetKnight.name, `Getting knight with id: ${knightId}...`);

    const knight = await this.knightDAO.getById(knightId);

    if (!knight) {
      throw new NotFoundError('Knight', knightId);
    }

    this.logger.info(GetKnight.name, `Knight found with id: ${knight.id}`);

    return knight;
  }
}
