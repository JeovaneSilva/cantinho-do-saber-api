import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { DiaSemana } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}

  private async _garantirQueAulaExiste(id: number) {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!aula) {
      throw new NotFoundException(`Aula com o ID ${id} não foi encontrada.`);
    }
  }


  async create(createAulaDto: CreateAulaDto, professorId: number) {
    const { alunosIds, ...dadosAula } = createAulaDto;

    if (dadosAula.horarioFim <= dadosAula.horarioInicio) {
      throw new ConflictException('O horário final deve ser depois do inicial.');
    }

    try {
      await this.prisma.aula.create({
        data: {
          ...dadosAula,
          professorId,
          alunos: {
            connect: alunosIds?.map((id) => ({ id })), 
          },
        },
      });

      return { message: 'Aula agendada com sucesso!' };
    } catch (error) {
      console.error('[AulaService.create] Erro:', error);
      throw new InternalServerErrorException('Erro ao agendar a aula. Verifique os dados e tente novamente.');
    }
  }

  async findAll(dia?: DiaSemana) {
    try {
      const where = dia ? { diaSemana: dia } : {};
      
      return await this.prisma.aula.findMany({
        where,
        include: { 
          alunos: true
        },
        orderBy: [
          { diaSemana: 'asc' },
          { horarioInicio: 'asc' }
        ]
      });
    } catch (error) {
      console.error('[AulaService.findAll] Erro:', error);
      throw new InternalServerErrorException('Erro ao buscar a lista de aulas.');
    }
  }

  async update(id: number, updateAulaDto: UpdateAulaDto) {
    if (updateAulaDto.horarioInicio && updateAulaDto.horarioFim) {
        if (updateAulaDto.horarioFim <= updateAulaDto.horarioInicio) {
            throw new ConflictException('O horário final deve ser depois do inicial.');
        }
    }

    try {
      await this._garantirQueAulaExiste(id);
      
      return await this.prisma.aula.update({
          where: { id },
          data: updateAulaDto,
          include: { alunos: true }
      });
    } catch (error) {
      console.error(`[AulaService.update] Erro no ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao atualizar os dados da aula.');
    }
  }

  async remove(id: number) {
    try {
      await this._garantirQueAulaExiste(id);

      await this.prisma.aula.delete({
          where: { id }
      });

      return { message: 'Aula cancelada com sucesso!' };
    } catch (error) {
      console.error(`[AulaService.remove] Erro no ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao cancelar a aula.');
    }
  }

  async addAluno(aulaId: number, alunoId: number) {
     try {
       await this._garantirQueAulaExiste(aulaId);

       return await this.prisma.aula.update({
         where: { id: aulaId },
         data: {
           alunos: {
             connect: { id: alunoId }
           }
         },
         include: { alunos: true }
       });
     } catch (error) {
       console.error(`[AulaService.addAluno] Erro na Aula ${aulaId}:`, error);
       if (error instanceof NotFoundException) throw error;
       throw new InternalServerErrorException('Erro ao adicionar o aluno na aula.');
     }
  }

  async removeAluno(aulaId: number, alunoId: number) {
     try {
       await this._garantirQueAulaExiste(aulaId);

       return await this.prisma.aula.update({
         where: { id: aulaId },
         data: {
           alunos: {
             disconnect: { id: alunoId }
           }
         },
         include: { alunos: true }
       });
     } catch (error) {
       console.error(`[AulaService.removeAluno] Erro na Aula ${aulaId}:`, error);
       if (error instanceof NotFoundException) throw error;
       throw new InternalServerErrorException('Erro ao remover o aluno da aula.');
     }
  }
}