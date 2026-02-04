import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Injectable()
export class MaterialDidaticoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateMaterialDidaticoDto, file: Express.Multer.File) {
    try {
      const materiaExiste = await this.prisma.materia.findUnique({
        where: { id: createDto.materiaId },
      });

      if (!materiaExiste) {
        throw new NotFoundException(`Matéria com ID ${createDto.materiaId} não encontrada.`);
      }

      const caminhoArquivo = `${file.filename}`; 

      return await this.prisma.materialDidatico.create({
        data: {
          titulo: createDto.titulo,
          tipo: createDto.tipo,
          materiaId: createDto.materiaId,
          totalDownloads: createDto.totalDownloads || 0,
          urlArquivo: caminhoArquivo, 
        },
      });

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erro ao cadastrar o material didático.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.materialDidatico.findMany({
        include: {
          materia: true, 
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar materiais.');
    }
  }

  async findOne(id: number) {
    try {
      const material = await this.prisma.materialDidatico.findUnique({
        where: { id },
        include: { materia: true },
      });

      if (!material) {
        throw new NotFoundException(`Material didático com ID ${id} não encontrado.`);
      }

      return material;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar o material.');
    }
  }

  async update(id: number, updateDto: UpdateMaterialDidaticoDto) {
    try {
      await this.findOne(id);

      if (updateDto.materiaId) {
        const novaMateriaExiste = await this.prisma.materia.findUnique({
          where: { id: updateDto.materiaId },
        });
        if (!novaMateriaExiste) {
          throw new NotFoundException(`A nova matéria informada (ID ${updateDto.materiaId}) não existe.`);
        }
      }

      return await this.prisma.materialDidatico.update({
        where: { id },
        data: updateDto,
      });

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erro ao atualizar o material.');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id); 

      return await this.prisma.materialDidatico.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erro ao remover o material.');
    }
  }
}