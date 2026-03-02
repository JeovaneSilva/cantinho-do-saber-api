import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pagamentos')
@UseGuards(AuthGuard)
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentosService.create(createPagamentoDto);
  }

 @Get()
  findAll(@Query('mes') mes?: string) {
    return this.pagamentosService.findAll(mes);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePagamentoDto: UpdatePagamentoDto) {
    return this.pagamentosService.update(id, updatePagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.remove(id);
  }
}
