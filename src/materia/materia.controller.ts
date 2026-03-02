import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards
} from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('materia')
@UseGuards(AuthGuard)
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll() {
    return this.materiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materiaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMateriaDto: UpdateMateriaDto
  ) {
    return this.materiaService.update(id, updateMateriaDto);
  }


}