import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMateriaDto {
  @IsString({ message: "nome da meteria deve ser uma string" })
  @IsNotEmpty({message: "nome da materia nao deve ser vazio"})
  nome: string;
}
