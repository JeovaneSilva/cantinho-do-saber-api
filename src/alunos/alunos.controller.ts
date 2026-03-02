import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('alunos')
@UseGuards(AuthGuard)
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunosService.create(createAlunoDto);
  }

  @Get()
  findAll() {
    return this.alunosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alunosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(id, updateAlunoDto);
  }

}
