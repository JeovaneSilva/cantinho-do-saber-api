import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  private _formatAluno(aluno: any) {
    if (!aluno) return null;
    
    const pagamentoDoMes = aluno.pagamentos && aluno.pagamentos.length > 0 ? aluno.pagamentos[0] : null;
    
    let statusAtual = 'PENDENTE';

    if (pagamentoDoMes) {
      statusAtual = pagamentoDoMes.status;

      if (statusAtual === 'PENDENTE' && pagamentoDoMes.dataVencimento) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataVencimento = new Date(pagamentoDoMes.dataVencimento);
        dataVencimento.setHours(0, 0, 0, 0);

        if (dataVencimento < hoje) {
          statusAtual = 'ATRASADO';
        }
      }
    }
    
    return {
      ...aluno,
      pagamentos: undefined,
      statusPagamento: statusAtual,
    };
  }

  async create(createAlunoDto: CreateAlunoDto) {
    try {
      await this.prisma.aluno.create({
        data: { ...createAlunoDto, status: 'ATIVO' },
      });
      
      return { message: 'Aluno cadastrado com sucesso!' };
    } catch (error) {
      console.error('[AlunosService.create] Erro:', error);
      throw new InternalServerErrorException('Erro ao cadastrar o aluno.');
    }
  }

  async findAll() {
    try {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999);

      const alunos = await this.prisma.aluno.findMany({
        include: {
          pagamentos: {
            where: {
              dataVencimento: {
                gte: primeiroDiaMes,
                lte: ultimoDiaMes,
              }
            },
            orderBy: { dataVencimento: 'desc' },
            take: 1,
          },
        },
      });

      return alunos.map((aluno) => this._formatAluno(aluno));
    } catch (error) {
      console.error('[AlunosService.findAll] Erro:', error);
      throw new InternalServerErrorException('Erro ao listar os alunos.');
    }
  }

  async findOne(id: number) {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: id },
        include: {
          pagamentos: {
            orderBy: { dataVencimento: 'desc' },
            take: 1,
          },
        },
      });

      if (!aluno) {
        throw new NotFoundException(`Aluno com o ID ${id} não foi encontrado.`);
      }

      return this._formatAluno(aluno);
    } catch (error) {
      console.error(`[AlunosService.findOne] Erro no ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro interno ao buscar o aluno.');
    }
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    try {
      const alunoExiste = await this.prisma.aluno.findUnique({ where: { id: id } });
      if (!alunoExiste) {
        throw new NotFoundException(`Não é possível atualizar: Aluno com ID ${id} não encontrado.`);
      }

      const alunoAtualizado = await this.prisma.aluno.update({
        where: { id: id },
        data: updateAlunoDto,
        include: {
          pagamentos: {
            orderBy: { dataVencimento: 'desc' },
            take: 1,
          },
        },
      });

      return this._formatAluno(alunoAtualizado);
    } catch (error) {
      console.error(`[AlunosService.update] Erro no ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao tentar atualizar os dados do aluno.');
    }
  }
  
  async remove(id: number) {
    try {
      const alunoExiste = await this.prisma.aluno.findUnique({ where: { id: id } });
      if (!alunoExiste) {
        throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
      }

      await this.prisma.aluno.delete({
        where: { id: id }
      });

      return { message: 'Aluno removido com sucesso' };
    } catch (error) {
      console.error(`[AlunosService.remove] Erro no ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao excluir aluno. Verifique se ele possui pagamentos ou aulas vinculadas.');
    }
  }
}