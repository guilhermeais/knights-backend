import { KnightAttributesKeys, KnightType } from '@/domain/entities/knight';

export type KnightDAOModel = {
  id: string;
  name: string;
  nickname: string;
  age: number;
  weaponsQuantity: number;
  keyAttribute: KnightAttributesKeys;
  attack: number;
  experience: number;
  type: KnightType;
};

export type KnightDAOGetAllParams = {
  type: KnightType;
};
export abstract class KnightDAO {
  abstract getAll(params?: KnightDAOGetAllParams): Promise<KnightDAOModel[]>;
}
