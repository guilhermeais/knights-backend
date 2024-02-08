import {
  KnightDAO,
  KnightDAOGetAllParams,
  KnightDAOModel,
} from '@/application/protocols/dao/knight.dao';
import { KnightType } from '@/domain/entities/knight';
import { faker } from '@faker-js/faker';

export function makeKnightDaoModel(
  modifications?: Partial<KnightDAOModel>,
): KnightDAOModel {
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

export class KnightInMemoryDAO implements KnightDAO {
  knights: Map<string, KnightDAOModel> = new Map();

  constructor(initialKnights: KnightDAOModel[] = []) {
    initialKnights.forEach((knight) => this.knights.set(knight.id, knight));
  }

  async getAll(params?: KnightDAOGetAllParams): Promise<KnightDAOModel[]> {
    return Array.from(this.knights.values()).filter(
      (knight) => !params?.type || knight.type === params.type,
    );
  }
}
