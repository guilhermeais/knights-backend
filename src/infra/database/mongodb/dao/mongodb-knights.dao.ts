import {
  KnightDAO,
  KnightDAOGetAllParams,
  KnightDTO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { KnightModel } from '../schemas/knight.schema';

export class MongoDBKnightsDAO implements KnightDAO {
  constructor(
    @Inject(KnightModel.name)
    private readonly knightModel: Model<KnightModel>,
  ) {}

  async getAll(params?: KnightDAOGetAllParams): Promise<SimpleKnightDTO[]> {
    const result = await this.knightModel.aggregate([
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
        },
      },
    ]);

    return result;
  }

  async getById(id: string): Promise<KnightDTO> {
    return null;
  }
}
