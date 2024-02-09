import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';

export type SimpleKnightDTO = {
  id: string;
  name: string;
  nickname: string;
  age: number;
  weaponsQuantity: number;
  keyAttribute: KnightAttributesEnum;
  attack: number;
  experience: number;
  type: KnightType;
};

export type KnightDTO = {
  id: string;
  name: string;
  nickname: string;
  birthday: Date;
  age: number;
  attributes: KnightAttributes;
  keyAttribute: KnightAttributesEnum;
  weapons?: KnightWeapon[];
  type: KnightType;
  attack: number;
  experience: number;
};

export type KnightDAOGetAllParams = {
  type: KnightType;
};
export abstract class KnightDAO {
  abstract getAll(params?: KnightDAOGetAllParams): Promise<SimpleKnightDTO[]>;
  abstract getById(id: string): Promise<KnightDTO>;
}
