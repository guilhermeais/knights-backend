import {
  KnightDAO,
  KnightDAOGetAllParams,
  KnightDTO,
  SimpleKnightDTO,
} from '@/application/protocols/dao/knight.dao';
import { KnightType } from '@/domain/entities/knight';
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
    keyAttribute: 'strength',
    name: faker.person.fullName(),
    nickname: faker.person.firstName(),
    type: KnightType.HERO,
    weaponsQuantity: faker.number.int(),
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
    keyAttribute: 'strength',
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

  async getAll(params?: KnightDAOGetAllParams): Promise<SimpleKnightDTO[]> {
    return Array.from(this.knights.values())
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
      }));
  }
}
