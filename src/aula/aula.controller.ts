import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { DiaSemana } from 'generated/prisma';

@Controller('aulas') 
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    const professorId = 1; 
    return this.aulaService.create(createAulaDto, professorId);
  }

  @Get()
  findAll(@Query('dia') dia?: DiaSemana) {
    return this.aulaService.findAll(dia);
  }

  @Patch(':id/adicionar-aluno/:alunoId')
  addAluno(
    @Param('id', ParseIntPipe) aulaId: number,
    @Param('alunoId', ParseIntPipe) alunoId: number
  ) {
    return this.aulaService.addAluno(aulaId, alunoId);
  }

  @Patch(':id/remover-aluno/:alunoId')
  removeAluno(
    @Param('id', ParseIntPipe) aulaId: number,
    @Param('alunoId', ParseIntPipe) alunoId: number
  ) {
    return this.aulaService.removeAluno(aulaId, alunoId);
  }
}