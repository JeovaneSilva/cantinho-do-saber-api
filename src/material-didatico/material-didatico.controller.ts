import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('materiais-didaticos')
@UseGuards(AuthGuard)
export class MaterialDidaticoController {
  constructor(private readonly materialService: MaterialDidaticoService) {}

 @Post()
  @UseInterceptors(FilesInterceptor('arquivos', 10, {
    storage: memoryStorage(), 
  }))
  create(
    @Body() createDto: CreateMaterialDidaticoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Pelo menos um arquivo é obrigatório.');
    }
    return this.materialService.create(createDto, files);
  }
   
  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMaterialDidaticoDto,
  ) {
    return this.materialService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.remove(id);
  }
}
