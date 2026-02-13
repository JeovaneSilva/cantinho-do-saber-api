import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PagamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto) {
    const { dataVencimento } = createPagamentoDto;
    return this.prisma.pagamento.create({
      data: { 
        ...createPagamentoDto,
        dataVencimento: new Date(dataVencimento) 
      }
    });
  }

  // Alterado para aceitar o mês opcional
  async findAll(mes?: string) {
    // Se vier mês, filtra. Se não, traz tudo.
    const where = mes ? { mesReferencia: mes } : {};

    return this.prisma.pagamento.findMany({
      where, 
      include: {
        aluno: {
          select: { nome: true }
        }
      },
      orderBy: {
        dataVencimento: 'asc' // Opcional: ordena por vencimento
      }
    });
  }

  // ... findOne, update, remove (mantidos igual ao seu código)
  findOne(id: number) {
    return this.prisma.pagamento.findUnique({ where: { id } });
  }

  async update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    const data: any = { ...updatePagamentoDto };
    
    // Converte datas se existirem
    if (data.dataVencimento) {
       data.dataVencimento = new Date(data.dataVencimento);
    }
    if (data.dataPagamento) {
       data.dataPagamento = new Date(data.dataPagamento);
    }

    return this.prisma.pagamento.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pagamento.delete({ where: { id } });
  }
}