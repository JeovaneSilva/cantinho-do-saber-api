import { Injectable } from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAlunoDto: CreateAlunoDto) {
    return this.prisma.aluno.create({
      data: { ...createAlunoDto, status: 'ATIVO' },
    });
  }

  async findAll() {
    const alunos = await this.prisma.aluno.findMany({
      include: {
        pagamentos: {
          orderBy: { dataVencimento: 'desc' }, 
          take: 1,
        },
      },
    });

    return alunos.map((aluno) => {
      const ultimoPagamento = aluno.pagamentos[0];
      return {
        ...aluno,
        statusPagamento: ultimoPagamento ? ultimoPagamento.status : 'PENDENTE',
      };
    });
  }

  findOne(id: number) {
    return this.prisma.aluno.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateAlunoDto: UpdateAlunoDto) {
    return this.prisma.aluno.update({
      where: { id: id },
      data: updateAlunoDto,
    });
  }
}