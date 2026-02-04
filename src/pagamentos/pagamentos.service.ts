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
      data: {...createPagamentoDto,dataVencimento: new Date(dataVencimento) }
    });
  }

  async findAll() {
    return this.prisma.pagamento.findMany({
      include: {
        aluno:{
          select: {nome: true}
        }
      }
    });
  }

  findOne(id: number) {
    return this.prisma.pagamento.findUnique({
      where: {id}
    });
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return `This action updates a #${id} pagamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagamento`;
  }
}
