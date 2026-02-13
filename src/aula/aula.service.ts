import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto'; // Importar
import { DiaSemana } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAulaDto: CreateAulaDto, professorId: number) {
    const { alunosIds, ...dadosAula } = createAulaDto;

    if (dadosAula.horarioFim <= dadosAula.horarioInicio) {
      throw new ConflictException('O horário final deve ser depois do inicial.');
    }

    return this.prisma.aula.create({
      data: {
        ...dadosAula,
        professorId,
        alunos: {
          connect: alunosIds?.map((id) => ({ id })), 
        },
      },
      include: {
        alunos: true, 
      }
    });
  }

  // --- NOVOS MÉTODOS ---

  async update(id: number, updateAulaDto: UpdateAulaDto) {
    // Validação de horário se estiverem sendo alterados
    if (updateAulaDto.horarioInicio && updateAulaDto.horarioFim) {
        if (updateAulaDto.horarioFim <= updateAulaDto.horarioInicio) {
            throw new ConflictException('O horário final deve ser depois do inicial.');
        }
    }

    // Se a pessoa mandar só um dos horários, idealmente deveríamos buscar o outro no banco para validar,
    // mas assumindo que o front manda ambos quando muda o horário:
    
    return this.prisma.aula.update({
        where: { id },
        data: updateAulaDto,
        include: { alunos: true } // Retorna os alunos para atualizar o front
    });
  }

  async remove(id: number) {
    // Verifica se existe antes (opcional, o prisma lança erro se não achar)
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula) throw new NotFoundException('Aula não encontrada');

    return this.prisma.aula.delete({
        where: { id }
    });
  }

  // ---------------------

  async addAluno(aulaId: number, alunoId: number) {
     return this.prisma.aula.update({
       where: { id: aulaId },
       data: {
         alunos: {
           connect: { id: alunoId }
         }
       },
       include: { alunos: true } // Importante para atualizar a lista no front imediatamente
     })
  }

  async removeAluno(aulaId: number, alunoId: number) {
     return this.prisma.aula.update({
       where: { id: aulaId },
       data: {
         alunos: {
           disconnect: { id: alunoId }
         }
       },
       include: { alunos: true }
     })
  }

  async findAll(dia?: DiaSemana) {
    const where = dia ? { diaSemana: dia } : {};
    
    return this.prisma.aula.findMany({
      where,
      include: { 
        alunos: true
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horarioInicio: 'asc' }
      ]
    });
  }
}