import { KnightAttributesEnum, KnightType } from '@/domain/entities/knight';
import { faker } from '@faker-js/faker';
import { CreateKnightDto } from '@/infra/http/dto/create-knight.dto';

export function makeCreateKnightDto(
  modifications?: Partial<CreateKnightDto>,
): CreateKnightDto {
  return {
    name: faker.person.fullName(),
    nickname: faker.person.firstName(),
    birthday: faker.date.past({
      years: 18,
    }),
    attributes: {
      strength: faker.number.int(),
      dexterity: faker.number.int(),
      constitution: faker.number.int(),
      intelligence: faker.number.int(),
      wisdom: faker.number.int(),
      charisma: faker.number.int(),
    },
    keyAttribute: KnightAttributesEnum.STRENGTH,
    weapons: [],
    type: KnightType.HERO,
    ...modifications,
  };
}
