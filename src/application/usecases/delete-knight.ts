import { Injectable } from '@nestjs/common';
import { KnightRepository } from '../protocols/repositories/knight.repository';
import { UseCase } from '../protocols/usecase.interface';
import { Logger } from '../protocols/gateways/logger.interface';

export type DeleteKnightRequest = {
  id: string;
};

export type DeleteKnightResponse = void;

@Injectable()
export class DeleteKnight
  implements UseCase<DeleteKnightRequest, Promise<DeleteKnightResponse>>
{
  constructor(
    private readonly knightRepository: KnightRepository,
    private readonly logger: Logger,
  ) {}

  async execute(request: DeleteKnightRequest): Promise<DeleteKnightResponse> {
    this.logger.info(
      DeleteKnight.name,
      `Deleting knight with id: ${request.id}`,
    );

    await this.knightRepository.softDelete(request.id);

    this.logger.info(
      DeleteKnight.name,
      `Knight with id: ${request.id} deleted`,
    );
  }
}
