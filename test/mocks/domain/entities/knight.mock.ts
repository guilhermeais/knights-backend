import { Knight, KnightProps } from '@/domain/entities/knight';
import { faker } from '@faker-js/faker';

export function makeKnight(modifications?: Partial<KnightProps>): Knight {
  return Knight.create(makeKnightProps(modifications));
}

export function makeKnightProps(
  modifications: Partial<KnightProps>,
): KnightProps {
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
    keyAttribute: 'strength',
    weapons: [],
    ...modifications,
  };
}
