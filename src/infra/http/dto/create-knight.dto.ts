import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class KnightAttributesDto implements KnightAttributes {
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber(null, {
    message: 'Atributo de sabedoria (wisdom) inválido.',
  })
  wisdom: number;

  @IsNumber(null, {
    message: 'Atributo de força (strength) inválido.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  strength: number;

  @IsNumber(null, {
    message: 'Atributo de destreza (dexterity) inválido.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  dexterity: number;

  @IsNumber(null, {
    message: 'Atributo de inteligência (intelligence) inválido.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  intelligence: number;

  @IsNumber(null, {
    message: 'Atributo de constituição (constitution) inválido.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  constitution: number;

  @IsNumber(null, {
    message: 'Atributo de carisma (charisma) inválido.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  charisma: number;
}

export class KnightWeaponDto implements KnightWeapon {
  @IsString({
    message: 'Nome da arma inválido.',
  })
  name: string;

  @IsNumber(null, {
    message: 'Modificador de dano da arma inválido.',
  })
  @Transform(({ value }) => value && Number(value))
  mod: number;

  @IsEnum(KnightAttributesEnum, {
    message: `Atributo da arma inválido. Os valores válidos são: ${Object.values(
      KnightAttributesEnum,
    ).join(', ')}`,
  })
  attr: KnightAttributesEnum;

  @IsOptional()
  @Transform(({ value }) => !!value)
  equipped: boolean;
}

export class CreateKnightDto {
  @IsString({
    message: 'Nome inválido.',
  })
  name: string;

  @IsString({
    message: 'Apelido inválido.',
  })
  nickname: string;

  @IsDate({
    message: 'Data de nascimento inválida.',
  })
  @Transform(({ value }) => new Date(value))
  birthday: Date;

  @Type(() => KnightAttributesDto)
  @IsOptional()
  attributes: KnightAttributesDto;

  @Type(() => KnightWeaponDto)
  @IsArray({
    each: true,
  })
  weapons?: KnightWeaponDto[];

  @IsEnum(KnightAttributesEnum, {
    message: `Atributo chave inválido. Os valores válidos são: ${Object.values(
      KnightAttributesEnum,
    ).join(', ')}`,
  })
  keyAttribute: KnightAttributesEnum;

  @IsEnum(KnightType)
  type: KnightType;
}
