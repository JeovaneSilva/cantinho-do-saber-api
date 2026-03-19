# 📚 Cantinho do Saber - API

Uma API RESTful robusta desenvolvida para gerenciar a plataforma educacional "Cantinho do Saber". Este back-end é responsável por gerenciar alunos, aulas, pagamentos, matérias e materiais didáticos, incluindo o upload de arquivos diretamente para a nuvem.

## 🚀 Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL (Hospedado via [Supabase](https://supabase.com/))
* **ORM:** [Prisma](https://www.prisma.io/)
* **Armazenamento em Nuvem:** Supabase Storage (Buckets)
* **Autenticação:** JWT (JSON Web Tokens) com `AuthGuard` customizado
* **Upload de Arquivos:** Multer (configurado com `memoryStorage` para integrações Serverless)
* **Deploy:** [Koyeb](https://www.koyeb.com/)

## ✨ Principais Funcionalidades

* **Autenticação e Autorização:** Proteção de rotas utilizando JWT, garantindo que apenas usuários logados acessem informações sensíveis.
* **Gestão Escolar:** CRUD completo de Alunos, Matérias e Aulas.
* **Controle Financeiro:** Gerenciamento de status de pagamentos dos alunos.
* **Gestão de Materiais Didáticos:**  Upload múltiplo de arquivos (PDFs, Imagens) processados em memória (`buffer`).
    * Integração direta com a API do Supabase Storage para salvar arquivos na nuvem.
    * Geração de URLs públicas com tipagem correta (`application/pdf`, `image/png`) para visualização nativa no navegador.
    * Sincronização de exclusão: ao remover um registro do banco, o arquivo físico também é apagado do bucket na nuvem.

## 🛠️ Configuração e Execução Local

### Pré-requisitos
* Node.js (v18+)
* Gerenciador de pacotes (npm ou yarn)
* Conta no Supabase (com um projeto e um bucket público criado chamado `materiais`)

### Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto e preencha com as suas credenciais:

```env
# Banco de dados (Prisma)
DATABASE_URL="sua-url-do-banco-postgresql-no-supabase"

# Autenticação
SECRET_KEY="sua-chave-secreta-para-gerar-o-jwt"
PORT=8000

# Nuvem (Supabase Storage)
SUPABASE_URL="[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)"
SUPABASE_KEY="sua-chave-service-role-aqui"
