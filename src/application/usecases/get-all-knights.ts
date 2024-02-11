import { KnightType } from '@/domain/entities/knight';
import { Injectable } from '@nestjs/common';
import { KnightDAO, SimpleKnightDTO } from '../protocols/dao/knight.dao';
import { Logger } from '../protocols/gateways/logger.interface';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../protocols/pagination.interface';
import { UseCase } from '../protocols/usecase.interface';

export type GetAllKnightsRequest = PaginatedRequest<{
  type?: KnightType;
}>;

export type GetAllKnightsResponse = PaginatedResponse<SimpleKnightDTO>;

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
      limit: params?.limit,
      page: params?.page,
    });

    this.logger.info(GetAllKnights.name, `Found ${knights.total} knights`);

    this.logger.debug(
      GetAllKnights.name,
      `Knights found: ${JSON.stringify(knights, null, 2)}`,
    );

    return knights;
  }
}
