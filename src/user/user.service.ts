import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const senhaHash = await bcrypt.hash(createUserDto.senha, 10);
    const user = await  this.prisma.user.create({
      data: {...createUserDto, senha: senhaHash}
    });
    return user
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {id: id}
    });
  }
}
