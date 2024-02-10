import { Knight } from '@/domain/entities/knight';

export class KnightPresenter {
  static toHTTP(aKnight: Knight) {
    return {
      id: aKnight.id,
      name: aKnight.name,
      nickname: aKnight.nickname,
      birthday: aKnight.birthday,
      attributes: aKnight.attributes,
      weapons: aKnight.weapons,
      keyAttribute: aKnight.keyAttribute,
      type: aKnight.type,
      age: aKnight.getAge(),
      experience: aKnight.experience,
      attack: aKnight.attack,
    };
  }
}
