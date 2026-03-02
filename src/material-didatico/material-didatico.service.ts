import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException,
  HttpException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class MaterialDidaticoService {
  private supabase: SupabaseClient;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string
    );
  }


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

  private async _garantirQueAlunoExiste(alunoId: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { id: true }
    });
    if (!aluno) throw new NotFoundException(`Aluno com ID ${alunoId} não existe no sistema.`);
  }


  async create(createDto: CreateMaterialDidaticoDto, files: Express.Multer.File[]) {
    try {
      await this._garantirQueMateriaExiste(createDto.materiaId);
      
      if (createDto.alunoId) {
         await this._garantirQueAlunoExiste(createDto.alunoId);
      }

    const promessasDeCriacao = files.map(async (file) => {
        const fileExt = file.originalname.split('.').pop()?.toLowerCase();
        const nomeArquivoUnico = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        let mimeTypeCorreto = file.mimetype;
        if (!mimeTypeCorreto || mimeTypeCorreto === 'application/octet-stream') {
            if (fileExt === 'pdf') mimeTypeCorreto = 'application/pdf';
            else if (fileExt === 'png') mimeTypeCorreto = 'image/png';
            else if (fileExt === 'jpg' || fileExt === 'jpeg') mimeTypeCorreto = 'image/jpeg';
            else mimeTypeCorreto = 'text/plain';
        }

        const { error } = await this.supabase.storage
          .from('materiais')
          .upload(nomeArquivoUnico, file.buffer, {
            contentType: mimeTypeCorreto,
            upsert: false
          });

        if (error) {
          console.error('Erro no Supabase:', error);
          throw new InternalServerErrorException('Falha ao enviar arquivo para a nuvem.');
        }

        const { data: urlData } = this.supabase.storage
          .from('materiais')
          .getPublicUrl(nomeArquivoUnico);

        const tituloFinal = files.length > 1 ? `${createDto.titulo} (${file.originalname})` : createDto.titulo;

        return this.prisma.materialDidatico.create({
          data: {
            titulo: tituloFinal,
            tipo: createDto.tipo,
            materiaId: createDto.materiaId,
            alunoId: createDto.alunoId || null,
            totalDownloads: createDto.totalDownloads || 0,
            urlArquivo: urlData.publicUrl,
          },
        });
      });

      await Promise.all(promessasDeCriacao);

      return { message: `${files.length} material(is) compartilhado(s) com sucesso na nuvem!` };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('[MaterialDidaticoService.create] Erro:', error);
      throw new InternalServerErrorException('Erro interno ao cadastrar os materiais didáticos.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.materialDidatico.findMany({
        include: {
          materia: true, 
          aluno: { select: { nome: true } } 
        },
        orderBy: { createdAt: 'desc' }
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
        include: { materia: true, aluno: { select: { nome: true } } },
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
        include: { materia: true, aluno: { select: { nome: true } } }
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(`[MaterialDidaticoService.update] Erro no ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao atualizar as informações do material.');
    }
  }

  async remove(id: number) {
    try {
      const material = await this.prisma.materialDidatico.findUnique({
        where: { id },
      });

      if (!material) {
        throw new NotFoundException(`Material didático com ID ${id} não foi encontrado.`);
      }

      const nomeArquivo = material.urlArquivo.split('/').pop();

      if (nomeArquivo) {
        const { error } = await this.supabase.storage
          .from('materiais')
          .remove([nomeArquivo]);

        if (error) {
          console.error('Erro ao deletar arquivo físico no Supabase:', error);
        }
      }

      await this.prisma.materialDidatico.delete({
        where: { id },
      });

      return { message: 'Material didático e arquivo removidos com sucesso!' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(`[MaterialDidaticoService.remove] Erro no ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao tentar remover o material.');
    }
  }
}