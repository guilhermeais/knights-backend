import { KnightDTO } from '@/application/protocols/dao/knight.dao';
import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class KnightAttributesModel implements KnightAttributes {
  @Prop()
  strength: number;

  @Prop()
  dexterity: number;

  @Prop()
  constitution: number;

  @Prop()
  intelligence: number;

  @Prop()
  wisdom: number;

  @Prop()
  charisma: number;
}

export class KnightWeaponModel implements KnightWeapon {
  @Prop()
  name: string;

  @Prop()
  mod: number;

  @Prop()
  attr: KnightAttributesEnum;

  @Prop()
  equipped: boolean;
}

@Schema()
export class KnightModel implements KnightDTO {
  static get modelName() {
    return 'knight' as const;
  }

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  nickname: string;

  @Prop()
  birthday: Date;

  @Prop()
  age: number;

  @Prop()
  attributes: KnightAttributesModel;

  @Prop()
  keyAttribute: KnightAttributesEnum;

  @Prop([KnightWeaponModel])
  weapons?: KnightWeapon[];

  @Prop()
  type: KnightType;

  @Prop()
  attack: number;

  @Prop()
  experience: number;
}

export const KnightSchema = SchemaFactory.createForClass(KnightModel);
