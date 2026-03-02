import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query, 
  ParseIntPipe, 
  UseGuards
} from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { DiaSemana } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('aulas') 
@UseGuards(AuthGuard)
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAulaDto: UpdateAulaDto
  ) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulaService.remove(id);
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