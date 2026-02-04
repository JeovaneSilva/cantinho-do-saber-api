import { 
  IsString, 
  IsOptional,  
  IsNumber, 
  IsNotEmpty, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlunoDto {
  @IsString({ message: 'O nome deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O nome do aluno é obrigatório.' })
  nome: string;

  @IsString({ message: 'O nome do responsável deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do responsável é obrigatório.' })
  nomeResponsavel: string;

  @IsString()
  @IsOptional()
  telefoneResponsavel?: string;

  @IsNumber({}, { message: 'A mensalidade deve ser um número.' })
  @Min(0, { message: 'A mensalidade não pode ser negativa.' })
  @Type(() => Number)
  mensalidade: number;

  @IsString()
  @IsOptional()
  observacao?: string;
}