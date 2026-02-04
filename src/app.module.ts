import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AlunosModule } from './alunos/alunos.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { MateriaModule } from './materia/materia.module';
import { MaterialDidaticoModule } from './material-didatico/material-didatico.module';
import { AulaModule } from './aula/aula.module';

@Module({
  imports: [UserModule,AuthModule, AlunosModule, PagamentosModule, MateriaModule, MaterialDidaticoModule, AulaModule]
})
export class AppModule {}
