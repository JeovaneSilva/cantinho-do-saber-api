import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException,
  HttpException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Injectable()
export class MaterialDidaticoService {
  constructor(private readonly prisma: PrismaService) {}


  private async _garantirQueMaterialExiste(id: number) {
    const material = await this.prisma.materialDidatico.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!material) {
      throw new NotFoundException(`Material didático com ID ${id} não foi encontrado.`);
    }
  }

  private async _garantirQueMateriaExiste(materiaId: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id: materiaId },
      select: { id: true } 
    });

    if (!materia) {
      throw new NotFoundException(`Matéria com ID ${materiaId} não existe no sistema.`);
    }
  }


  async create(createDto: CreateMaterialDidaticoDto, file: Express.Multer.File) {
    try {
      await this._garantirQueMateriaExiste(createDto.materiaId);

      const caminhoArquivo = `${file.filename}`; 

      await this.prisma.materialDidatico.create({
        data: {
          titulo: createDto.titulo,
          tipo: createDto.tipo,
          materiaId: createDto.materiaId,
          totalDownloads: createDto.totalDownloads || 0,
          urlArquivo: caminhoArquivo, 
        },
      });

      return { message: 'Material didático compartilhado com sucesso!' };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('[MaterialDidaticoService.create] Erro:', error);
      throw new InternalServerErrorException('Erro interno ao cadastrar o material didático.');
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
      console.error('[MaterialDidaticoService.findAll] Erro:', error);
      throw new InternalServerErrorException('Erro ao buscar a lista de materiais.');
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
      if (error instanceof HttpException) throw error;
      console.error(`[MaterialDidaticoService.findOne] Erro no ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao buscar os detalhes do material.');
    }
  }

  async update(id: number, updateDto: UpdateMaterialDidaticoDto) {
    try {
      await this._garantirQueMaterialExiste(id);

      if (updateDto.materiaId) {
        await this._garantirQueMateriaExiste(updateDto.materiaId);
      }

      return await this.prisma.materialDidatico.update({
        where: { id },
        data: updateDto,
        include: { materia: true }
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(`[MaterialDidaticoService.update] Erro no ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao atualizar as informações do material.');
    }
  }

  async remove(id: number) {
    try {
      await this._garantirQueMaterialExiste(id); 

      await this.prisma.materialDidatico.delete({
        where: { id },
      });

      return { message: 'Material didático removido com sucesso!' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(`[MaterialDidaticoService.remove] Erro no ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao tentar remover o material.');
    }
  }
}