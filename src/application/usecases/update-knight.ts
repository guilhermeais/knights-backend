import { KnightWeapon } from '@/domain/entities/knight';
import { KnightRepository } from '../protocols/repositories/knight.repository';
import { UseCase } from '../protocols/usecase.interface';
import { Injectable } from '@nestjs/common';
import { Logger } from '../protocols/gateways/logger.interface';
import { NotFoundError } from '@/domain/errors/not-found.error';

export type UpdateKnightRequest = {
  id: string;
  nickname: string;
  weapons: KnightWeapon[];
};

export type UpdateKnightResponse = void;

Injectable();
export class UpdateKnight
  implements UseCase<UpdateKnightRequest, Promise<UpdateKnightResponse>>
{
  constructor(
    private readonly knightRepository: KnightRepository,
    private readonly logger: Logger,
  ) {}

  async execute(request: UpdateKnightRequest): Promise<UpdateKnightResponse> {
    const { id, nickname, weapons } = request;
    this.logger.info(
      UpdateKnight.name,
      `Updating knight with id: ${id}, nickname: ${nickname} and weapons: ${JSON.stringify(weapons, null, 2)}`,
    );

    const knight = await this.knightRepository.get(id);

    if (!knight) {
      this.logger.error(UpdateKnight.name, `Knight not found with id: ${id}`);
      throw new NotFoundError('Knight', id);
    }

    this.logger.info(UpdateKnight.name, `Knight found with id: ${knight.id}`);

    knight.setWeapons(weapons);
    knight.nickname = nickname;

    await this.knightRepository.update(knight);

    this.logger.info(
      UpdateKnight.name,
      `Knight updated with id: ${knight.id}, nickname: ${knight.nickname} and weapons: ${JSON.stringify(knight.weapons, null, 2)}`,
    );
  }
}
