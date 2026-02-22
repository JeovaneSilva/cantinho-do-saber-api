import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  HttpException
} from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateriaService {
  constructor(private readonly prisma: PrismaService) {}

  private async _garantirQueMateriaExiste(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!materia) {
      throw new NotFoundException(`Matéria com ID ${id} não encontrada.`);
    }
  }


  async create(createMateriaDto: CreateMateriaDto) {
    try {
      const materiaExiste = await this.prisma.materia.findUnique({
        where: { nome: createMateriaDto.nome },
      });

      if (materiaExiste) {
        throw new ConflictException('Já existe uma matéria com este nome.');
      }

      return await this.prisma.materia.create({
        data: createMateriaDto,
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;
      
      console.error('[MateriaService.create] Erro:', error);
      throw new InternalServerErrorException('Erro ao criar a matéria.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.materia.findMany();
    } catch (error) {
      console.error('[MateriaService.findAll] Erro:', error);
      throw new InternalServerErrorException('Erro ao buscar as matérias.');
    }
  }

  async findOne(id: number) {
    try {
      const materia = await this.prisma.materia.findUnique({
        where: { id },
      });

      if (!materia) {
        throw new NotFoundException(`Matéria com ID ${id} não encontrada.`);
      }

      return materia;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('[MateriaService.findOne] Erro:', error);
      throw new InternalServerErrorException('Erro ao buscar a matéria.');
    }
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    try {
      await this._garantirQueMateriaExiste(id);

      if (updateMateriaDto.nome) {
        const nomeEmUso = await this.prisma.materia.findUnique({
          where: { nome: updateMateriaDto.nome }
        });
        
        if (nomeEmUso && nomeEmUso.id !== id) {
             throw new ConflictException('Já existe outra matéria com este nome.');
        }
      }

      return await this.prisma.materia.update({
        where: { id },
        data: updateMateriaDto,
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('[MateriaService.update] Erro:', error);
      throw new InternalServerErrorException('Erro ao atualizar a matéria.');
    }
  }
}