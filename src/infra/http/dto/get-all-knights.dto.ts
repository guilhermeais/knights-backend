import { KnightType } from '@/domain/entities/knight';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetAllKnightsDto {
  @IsEnum(KnightType, {
    message: `Tipo de Knight inválido! Os possiveis valores são: ${Object.values(KnightType).join(', ')}`,
  })
  @IsOptional()
  type?: KnightType;

  @IsOptional()
  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Limite inválido.',
    },
  )
  @Transform(({ value }) => value && parseInt(value, 10))
  limit?: number;

  @IsOptional()
  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Página inválida.',
    },
  )
  @Transform(({ value }) => value && parseInt(value, 10))
  page?: number;
}
