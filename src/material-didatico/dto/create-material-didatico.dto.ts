import { IsString, IsNotEmpty, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMaterial } from 'generated/prisma';

export class CreateMaterialDidaticoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsEnum(TipoMaterial)
  @IsNotEmpty()
  tipo: TipoMaterial;


  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  materiaId: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  totalDownloads?: number;
}