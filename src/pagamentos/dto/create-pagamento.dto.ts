import { 
  IsString, 
  IsNotEmpty, 
  IsDateString, 
  IsNumber, 
  Min, 
  IsEnum, 
  IsOptional, 
  IsInt 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePagamentoDto {
  @IsString({ message: 'O mês de referência é obrigatório (ex: Janeiro).' })
  @IsNotEmpty()
  mesReferencia: string;

  @IsDateString({}, { message: 'A data de vencimento deve ser uma data válida (AAAA-MM-DD).' })
  @IsNotEmpty({ message: 'A data de vencimento é obrigatória.' })
  dataVencimento: string; 

  @IsNumber({}, { message: 'O valor deve ser um número.' })
  @Min(0, { message: 'O valor não pode ser negativo.' })
  @Type(() => Number) 
  valor: number;


  @IsInt({ message: 'O ID do aluno deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'É necessário vincular o pagamento a um aluno.' })
  alunoId: number;
}