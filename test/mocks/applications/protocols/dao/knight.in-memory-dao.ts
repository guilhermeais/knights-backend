import {
  KnightDAO,
  KnightDAOGetAllParams,
  KnightDTO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { PaginatedResponse } from '@/application/protocols/pagination.interface';
import { KnightAttributesEnum, KnightType } from '@/domain/entities/knight';
import { faker } from '@faker-js/faker';

export function makeSimpleKnightDaoModel(
  modifications?: Partial<SimpleKnightDTO>,
): SimpleKnightDTO {
  return {
    id: faker.string.uuid(),
    age: faker.number.int({
      max: 100,
      min: 0,
    }),
    attack: faker.number.int(),
    experience: faker.number.int(),
    keyAttribute: KnightAttributesEnum.STRENGTH,
    name: faker.person.fullName(),
    nickname: faker.person.firstName(),
    type: KnightType.HERO,
    weaponsQuantity: faker.number.int(),
    createdAt: faker.date.recent(),
    ...modifications,
  };
}

export function makeKnightDaoModel(
  modifications?: Partial<KnightDTO>,
): KnightDTO {
  return {
    id: faker.string.uuid(),
    age: faker.number.int({
      max: 100,
      min: 0,
    }),
    attack: faker.number.int(),
    experience: faker.number.int(),
    keyAttribute: KnightAttributesEnum.STRENGTH,
    name: faker.person.fullName(),
    nickname: faker.person.firstName(),
    type: KnightType.HERO,
    attributes: {
      charisma: 0,
      constitution: 0,
      dexterity: 0,
      intelligence: 0,
      strength: 0,
      wisdom: 0,
    },
    birthday: faker.date.recent(),
    weapons: [],
    createdAt: faker.date.recent(),
    ...modifications,
  };
}

export class KnightInMemoryDAO implements KnightDAO {
  knights: Map<string, KnightDTO> = new Map();

  constructor(initialKnights: KnightDTO[] = []) {
    initialKnights.forEach((knight) => this.knights.set(knight.id, knight));
  }

  async getById(id: string): Promise<KnightDTO> {
    return this.knights.get(id);
  }

  async getAll(
    params?: KnightDAOGetAllParams,
  ): Promise<PaginatedResponse<SimpleKnightDTO>> {
    const allKnights = Array.from(this.knights.values())
      .filter((knight) => !params?.type || knight.type === params.type)
      .map((knight) => ({
        id: knight.id,
        age: knight.age,
        name: knight.name,
        attack: knight.attack,
        experience: knight.experience,
        keyAttribute: knight.keyAttribute,
        nickname: knight.nickname,
        type: knight.type,
        weaponsQuantity: knight.weapons.length,
        createdAt: knight.createdAt,
        updatedAt: knight.updatedAt,
      }));

    return this.paginateArray(
      allKnights,
      params?.page || 1,
      params?.limit || 10,
    );
  }

  private paginateArray<T>(
    array: T[],
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const totalPages = Math.ceil(array.length / limit);
    return {
      data: array.slice(start, end),
      total: array.length,
      page,
      limit,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }
}
