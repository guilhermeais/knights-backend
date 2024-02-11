import { Knight } from '@/domain/entities/knight';
import { Document } from 'mongoose';
import { KnightModel } from '../schemas/knight.schema';

export class MongoDbKnightMapper {
  static toMongoDb(knight: Knight): KnightModel {
    return {
      _id: knight.id,
      id: knight.id,
      age: knight.getAge(),
      attack: knight.attack,
      attributes: knight.attributes,
      birthday: knight.birthday,
      experience: knight.experience,
      keyAttribute: knight.keyAttribute,
      name: knight.name,
      nickname: knight.nickname,
      type: knight.type,
      weapons: knight.weapons,
    };
  }

  static toDomain(knightDb: Document<unknown, object, KnightModel>): Knight {
    const knightDbJSON = knightDb.toJSON();
    return Knight.restore(
      knightDbJSON.id,
      {
        attributes: knightDbJSON.attributes,
        birthday: knightDbJSON.birthday,
        keyAttribute: knightDbJSON.keyAttribute,
        name: knightDbJSON.name,
        nickname: knightDbJSON.nickname,
        type: knightDbJSON.type,
        weapons: knightDbJSON.weapons.map((weapon) => ({
          attr: weapon.attr,
          equipped: weapon.equipped,
          mod: weapon.mod,
          name: weapon.name,
        })),
      },
      knightDbJSON.createdAt,
      knightDbJSON.updatedAt,
    );
  }
}
