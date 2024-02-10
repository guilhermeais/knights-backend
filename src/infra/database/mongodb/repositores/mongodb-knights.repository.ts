import { KnightRepository } from '@/application/protocols/repositories/knight.repository';
import { Knight } from '@/domain/entities/knight';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoDbKnightMapper } from '../mappers/mongodb-knight.mapper';
import { KnightModel } from '../schemas/knight.schema';

export class MongoDBKnightsRepository implements KnightRepository {
  constructor(
    @Inject(KnightModel.name)
    private readonly knightModel: Model<KnightModel>,
  ) {}

  async get(id: string): Promise<Knight> {
    const knightDb = await this.knightModel
      .findById(id)
      .where({
        deletedAt: null,
      })
      .exec();

    return knightDb && MongoDbKnightMapper.toDomain(knightDb);
  }

  async create(knight: Knight): Promise<Knight> {
    const knightDb = await this.knightModel.create(
      MongoDbKnightMapper.toMongoDb(knight),
    );

    return MongoDbKnightMapper.toDomain(knightDb);
  }

  async update(knight: Knight): Promise<void> {
    await this.knightModel
      .updateOne({ _id: knight.id }, MongoDbKnightMapper.toMongoDb(knight))
      .exec();

    return;
  }

  async softDelete(id: string): Promise<void> {
    await this.knightModel.updateOne({ _id: id }, { deletedAt: new Date() });
  }
}
