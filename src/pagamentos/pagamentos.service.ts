import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException,
  HttpException
} from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PagamentosService {
  constructor(private readonly prisma: PrismaService) {}


  private async _garantirQuePagamentoExiste(id: number) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento com o ID ${id} não foi encontrado.`);
    }
  }

  private async _garantirQueAlunoExiste(alunoId: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { id: true }
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${alunoId} não encontrado no sistema.`);
    }
  }

  async create(createPagamentoDto: CreatePagamentoDto) {
    try {
      await this._garantirQueAlunoExiste(createPagamentoDto.alunoId);

      const { dataVencimento, ...restoDados } = createPagamentoDto;

      await this.prisma.pagamento.create({
        data: { 
          ...restoDados,
          dataVencimento: new Date(dataVencimento) 
        }
      });

      return { message: 'Pagamento registrado com sucesso!' };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro interno ao registrar o pagamento.');
    }
  }

  async findAll(mes?: string) {
    try {
      const where = mes ? { mesReferencia: mes } : {};

      return await this.prisma.pagamento.findMany({
        where, 
        include: {
          aluno: {
            select: { nome: true }
          }
        },
        orderBy: {
          dataVencimento: 'desc'
        }
      });

    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar a lista de pagamentos.');
    }
  }

  async findOne(id: number) {
    try {
      const pagamento = await this.prisma.pagamento.findUnique({ 
        where: { id },
        include: {
          aluno: { select: { nome: true } }
        }
      });

      if (!pagamento) {
        throw new NotFoundException(`Pagamento com o ID ${id} não encontrado.`);
      }

      return pagamento;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro ao buscar os detalhes do pagamento.');
    }
  }

  async update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    try {
      await this._garantirQuePagamentoExiste(id);

      const data: any = { ...updatePagamentoDto };
      
      if (data.alunoId) {
        await this._garantirQueAlunoExiste(data.alunoId);
      }

      if (data.dataVencimento) {
         data.dataVencimento = new Date(data.dataVencimento);
      }
      if (data.dataPagamento) {
         data.dataPagamento = new Date(data.dataPagamento);
      }

      return await this.prisma.pagamento.update({
        where: { id },
        data,
        include: {
          aluno: { select: { nome: true } } 
        }
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro ao tentar atualizar o pagamento.');
    }
  }

  async remove(id: number) {
    try {
      await this._garantirQuePagamentoExiste(id);

      await this.prisma.pagamento.delete({ 
        where: { id } 
      });

      return { message: 'Pagamento removido do sistema com sucesso!' };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro ao excluir o pagamento.');
    }
  }
}