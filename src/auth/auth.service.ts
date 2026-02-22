import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(userId: number) {
    try {
      const payload = {
        sub: userId,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '7d',
      });

      return { access_token: accessToken };
    } catch (error) {
      console.error('[AuthService.generateAccessToken] Erro:', error);
      throw new InternalServerErrorException('Erro interno ao gerar a sessão do usuário.');
    }
  }

  async signIn(params: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: params.email },
      });

      if (!user) {
        throw new UnauthorizedException('E-mail ou senha inválidos.');
      }

      const passwordMatch = await bcrypt.compare(params.senha, user.senha);
      if (!passwordMatch) {
        throw new UnauthorizedException('E-mail ou senha inválidos.');
      }

      return await this.generateAccessToken(user.id);
      
    } catch (error) {
      console.error('[AuthService.signIn] Erro:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Falha no servidor ao tentar realizar o login. Tente novamente.');
    }
  }
}