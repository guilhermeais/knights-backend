import { UpdateKnightDto } from '@/infra/http/dto/update-knight.dto';
import { faker } from '@faker-js/faker';

export function makeUpdateKnightDto(
  modifications?: Partial<UpdateKnightDto>,
): UpdateKnightDto {
  return {
    nickname: faker.person.firstName(),
    weapons: [],
    ...modifications,
  };
}
