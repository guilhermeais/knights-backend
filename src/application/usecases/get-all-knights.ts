import { Injectable } from '@nestjs/common';
import { KnightDAO, SimpleKnightDTO } from '../protocols/dao/knight.dao';
import { Logger } from '../protocols/gateways/logger.interface';
import { UseCase } from '../protocols/usecase.interface';
import { KnightType } from '@/domain/entities/knight';

export type GetAllKnightsRequest = {
  type?: KnightType;
};

export type GetAllKnightsResponse = SimpleKnightDTO[];

@Injectable()
export class GetAllKnights
  implements UseCase<GetAllKnightsRequest, Promise<GetAllKnightsResponse>>
{
  constructor(
    private readonly knightDAO: KnightDAO,
    private readonly logger: Logger,
  ) {}

  async execute(params?: GetAllKnightsRequest): Promise<GetAllKnightsResponse> {
    this.logger.info(
      GetAllKnights.name,
      `Getting all knights with: ${JSON.stringify(params, null, 2)}`,
    );
    const knights = await this.knightDAO.getAll({
      type: params?.type,
    });
    this.logger.info(GetAllKnights.name, `Found ${knights.length} knights`);

    this.logger.debug(
      GetAllKnights.name,
      `Knights found: ${JSON.stringify(knights, null, 2)}`,
    );

    return knights;
  }
}
