import { KnightDTO } from '@/application/protocols/dao/knight.dao';
import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Schema } from 'mongoose';

export class KnightModel implements KnightDTO {
  static get modelName() {
    return 'knight' as const;
  }

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
}

export const KnightSchema = new Schema<KnightModel, KnightModel>({
  id: String,
  name: String,
  nickname: String,
  birthday: Date,
  age: Number,
  attributes: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  keyAttribute: {
    type: String,
    enum: Object.values(KnightAttributesEnum),
  },
  weapons: [
    {
      name: String,
      mod: Number,
      attr: {
        type: String,
        enum: Object.values(KnightAttributesEnum),
      },
      equipped: Boolean,
    },
  ],
  type: {
    enum: Object.values(KnightType),
    type: String,
  },
  attack: Number,
  experience: Number,
});
