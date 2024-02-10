import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { KnightWeaponDto } from './create-knight.dto';

export class UpdateKnightDto {
  @IsString({
    message: 'Apelido inválido.',
  })
  nickname: string;

  @Type(() => KnightWeaponDto)
  @ValidateNested({
    each: true,
    message: 'Armas do guerreiro inválida(s).',
  })
  weapons?: KnightWeaponDto[];
}
