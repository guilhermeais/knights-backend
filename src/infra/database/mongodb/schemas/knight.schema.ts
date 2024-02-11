import { KnightDTO } from '@/application/protocols/dao/knight.dao';
import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Provider } from '@nestjs/common';
import { Mongoose, Schema } from 'mongoose';
import { MONGOOSE_CONNECTION_NAME } from '../utils/mongoose.connection.factory';

export class KnightModel implements KnightDTO {
  static get modelName() {
    return 'knights' as const;
  }

  _id: string;
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
  deletedAt?: Date;
  createdAt?: Date;
}

export const KnightModelProvider: Provider = {
  provide: KnightModel.name,
  inject: [MONGOOSE_CONNECTION_NAME],
  useFactory(mongoose: Mongoose) {
    return mongoose.model<KnightModel>(KnightModel.modelName, KnightSchema);
  },
};

export const KnightSchema = new Schema<KnightModel, KnightModel>(
  {
    _id: Schema.Types.UUID,
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
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
