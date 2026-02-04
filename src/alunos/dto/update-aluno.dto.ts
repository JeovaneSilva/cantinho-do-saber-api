import { PartialType } from '@nestjs/mapped-types';
import { CreateAlunoDto } from './create-aluno.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusAluno } from 'generated/prisma';

export class UpdateAlunoDto extends PartialType(CreateAlunoDto) {
      @IsEnum(StatusAluno, { message: 'O status deve ser ATIVO ou INATIVO.' })
      @IsOptional()
      status?: StatusAluno;
}