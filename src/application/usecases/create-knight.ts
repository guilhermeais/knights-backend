import {
  Knight,
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Injectable } from '@nestjs/common';
import { KnightRepository } from '../protocols/repositories/knight.repository';
import { UseCase } from '../protocols/usecase.interface';
import { Logger } from '../protocols/gateways/logger.interface';

export type CreateKnightRequest = {
  name: string;
  nickname: string;
  birthday: Date;
  attributes: KnightAttributes;
  weapons?: KnightWeapon[];
  keyAttribute: KnightAttributesEnum;
  type: KnightType;
};

export type CreateKnightResponse = Knight;

@Injectable()
export class CreateKnight
  implements UseCase<CreateKnightRequest, Promise<CreateKnightResponse>>
{
  constructor(
    private readonly knightRepository: KnightRepository,
    private readonly logger: Logger,
  ) {}

  async execute(request: CreateKnightRequest): Promise<CreateKnightResponse> {
    this.logger.info(
      CreateKnight.name,
      `Creating a new knight with name: ${request.name}`,
    );

    const knight = Knight.create(request);
    await this.knightRepository.create(knight);

    this.logger.info(
      CreateKnight.name,
      `Knight ${knight.name} created with id: ${knight.id}`,
    );

    return knight;
  }
}
