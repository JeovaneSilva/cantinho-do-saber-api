-- CreateEnum
CREATE TYPE "StatusAluno" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PAGO', 'PENDENTE', 'ATRASADO');

-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('PDF', 'IMAGEM');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "status" "StatusAluno" NOT NULL DEFAULT 'ATIVO',
    "dataMatricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nomeResponsavel" TEXT NOT NULL,
    "telefoneResponsavel" TEXT,
    "mensalidade" DECIMAL(65,30) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id" SERIAL NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFim" TEXT NOT NULL,
    "observacoes" TEXT,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "dataPagamento" TIMESTAMP(3),
    "alunoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiais_didaticos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoMaterial" NOT NULL,
    "urlArquivo" TEXT NOT NULL,
    "totalDownloads" INTEGER NOT NULL DEFAULT 0,
    "alunoId" INTEGER,
    "materiaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "materiais_didaticos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlunoToAula" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "materias_nome_key" ON "materias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_AlunoToAula_AB_unique" ON "_AlunoToAula"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunoToAula_B_index" ON "_AlunoToAula"("B");

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiais_didaticos" ADD CONSTRAINT "materiais_didaticos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiais_didaticos" ADD CONSTRAINT "materiais_didaticos_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "materias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToAula" ADD CONSTRAINT "_AlunoToAula_A_fkey" FOREIGN KEY ("A") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToAula" ADD CONSTRAINT "_AlunoToAula_B_fkey" FOREIGN KEY ("B") REFERENCES "aulas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
