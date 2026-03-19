import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  InternalServerErrorException,
  HttpException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private _formatUser(user: any) {
    if (!user) return null;
    
    const { senha, ...userSeguro } = user;
    return userSeguro;
  }


  async create(createUserDto: CreateUserDto) {
    try {
      const emailEmUso = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
        select: { id: true }
      });

      if (emailEmUso) {
        throw new ConflictException('Já existe uma conta registrada com este e-mail.');
      }

      const senhaHash = await bcrypt.hash(createUserDto.senha, 10);
      
      const user = await this.prisma.user.create({
        data: { ...createUserDto, senha: senhaHash }
      });
      
      return this._formatUser(user);

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro interno ao tentar criar o usuário.');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      
      return users.map(user => this._formatUser(user));

    } catch (error) {
      console.error('[UserService.findAll] Erro:', error);
      throw new InternalServerErrorException('Erro ao buscar a lista de usuários.');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado no sistema.`);
      }

      return this._formatUser(user);

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Erro ao buscar as informações do usuário.');
    }
  }
}