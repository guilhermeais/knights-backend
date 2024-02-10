import {
  KnightAttributes,
  KnightAttributesEnum,
  KnightType,
  KnightWeapon,
} from '@/domain/entities/knight';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class KnightAttributesDto implements KnightAttributes {
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'wisdom: Atributo de sabedoria (wisdom) inválido.',
    },
  )
  wisdom?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'strength: Atributo de força (strength) inválido.',
    },
  )
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  strength?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'dexterity: Atributo de destreza (dexterity) inválido.',
    },
  )
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  dexterity?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message:
        'intelligence: Atributo de inteligência (intelligence) inválido.',
    },
  )
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  intelligence?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message:
        'constitution: Atributo de constituição (constitution) inválido.',
    },
  )
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  constitution?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'charisma: Atributo de carisma (charisma) inválido.',
    },
  )
  @IsOptional()
  @Transform((data) => data?.value && Number(data.value ?? 0))
  charisma?: number;
}

export class KnightWeaponDto implements KnightWeapon {
  @IsString({
    message: 'name: Nome da arma inválido.',
  })
  name: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'mod: Modificador de dano da arma inválido.',
    },
  )
  @Transform(({ value }) => value && Number(value))
  mod: number;

  @IsEnum(KnightAttributesEnum, {
    message: `attr: Atributo da arma inválido. Os valores válidos são: ${Object.values(
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
  @Transform(({ value }) => value && new Date(value))
  birthday: Date;

  @ValidateNested({
    message: 'Há algum propriedade inválida nos atributos do guerreiro.',
  })
  @Type(() => KnightAttributesDto)
  @IsObject({
    message: 'Atributos inválidos.',
  })
  @IsOptional()
  attributes: KnightAttributesDto;

  @Type(() => KnightWeaponDto)
  @ValidateNested({
    each: true,
    message: 'Armas do guerreiro inválida(s).',
  })
  weapons?: KnightWeaponDto[];

  @IsEnum(KnightAttributesEnum, {
    message: `Atributo chave inválido. Os valores válidos são: ${Object.values(
      KnightAttributesEnum,
    ).join(', ')}`,
  })
  keyAttribute: KnightAttributesEnum;

  @IsEnum(KnightType, {
    message: `Tipo inválido. Os valores válidos são: ${Object.values(
      KnightType,
    ).join(', ')}`,
  })
  type: KnightType;
}
