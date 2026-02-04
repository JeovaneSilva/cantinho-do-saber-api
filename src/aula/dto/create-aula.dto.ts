import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEnum, 
  Matches,
  IsArray,
  IsInt
} from 'class-validator';
import { DiaSemana } from 'generated/prisma';

export class CreateAulaDto {
  @IsEnum(DiaSemana)
  @IsNotEmpty()
  diaSemana: DiaSemana;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horarioInicio: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horarioFim: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsArray({ message: 'Envie uma lista de IDs de alunos.' })
  @IsInt({ each: true, message: 'Cada ID deve ser um número inteiro.' })
  @IsOptional() 
  alunosIds?: number[]; 
}