import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
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

  async addAluno(aulaId: number, alunoId: number) {
     return this.prisma.aula.update({
       where: { id: aulaId },
       data: {
         alunos: {
           connect: { id: alunoId }
         }
       }
     })
  }

  async removeAluno(aulaId: number, alunoId: number) {
     return this.prisma.aula.update({
       where: { id: aulaId },
       data: {
         alunos: {
           disconnect: { id: alunoId }
         }
       }
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