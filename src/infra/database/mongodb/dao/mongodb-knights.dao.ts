import {
  KnightDAO,
  KnightDAOGetAllParams,
  KnightDTO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { KnightModel } from '../schemas/knight.schema';
import { PaginatedResponse } from '@/application/protocols/pagination.interface';

export class MongoDBKnightsDAO implements KnightDAO {
  constructor(
    @Inject(KnightModel.name)
    private readonly knightModel: Model<KnightModel>,
  ) {}

  async getAll(
    params?: KnightDAOGetAllParams,
  ): Promise<PaginatedResponse<SimpleKnightDTO>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const [result] = await this.knightModel.aggregate<{
      metadata: { totalCount: number }[];
      data: SimpleKnightDTO[];
    }>([
      {
        $match: {
          deletedAt: null,
          ...(params?.type ? { type: params.type } : {}),
        },
      },
      { $addFields: { weaponsQuantity: { $size: '$weapons' } } },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          nickname: 1,
          age: 1,
          weaponsQuantity: 1,
          keyAttribute: 1,
          attack: 1,
          experience: 1,
          type: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const [metadata] = result?.metadata;

    const total = metadata?.totalCount ?? 0;
    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data: result.data,
      limit,
      page,
      total,
      nextPage,
      totalPages,
    };
  }

  async getById(id: string): Promise<KnightDTO> {
    const result = await this.knightModel.findById(id, {
      _id: 0,
      'weapons._id': 0,
    });

    return result.toJSON();
  }
}
