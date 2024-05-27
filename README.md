# Lumi Test

Este repositório é dividido em duas partes principais: backend e frontend. A aplicação tem como objetivo demonstrar a integração entre um servidor Express.js utilizando Prisma como ORM e um cliente React.js.

## Estrutura do Projeto

- **backend/**: Contém o código do servidor Express.js.
  - **prisma/**: Configuração do Prisma e o cliente Prisma.
  - **controllers/**: Controladores para as rotas da API.
  - **routes/**: Definição das rotas da API.
  - **utils/**: Utilitários usados no projeto.
  - **tests/**: Testes unitários e de integração para o backend.
  - **scripts/**: Script em Python que faz importação de PDFs para o banco de dados

- **frontend/**: Contém o código do cliente React.js.
  - **src/**: Código-fonte do frontend.
  - **public/**: Arquivos públicos estáticos.

## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - Prisma ORM
  - Jest (para testes)
  - Supertest (para testes de integração)
  - Python 3.9 (para o script)
  
- **Frontend**:
  - React.js
  - TypeScript
  - HTML/CSS

## Instalação

### Backend

1. Navegue até o diretório `backend`:
   ```sh
   cd backend
2. Caso seja a primeira vez:
   ```sh
    pip install poetry
    poetry shell
    poetry install
    python scripts/extract_data.py
3. Instale as dependências:
   ```sh
   npm install
5. Adicione a URL do banco de dados no arquivo `.env`:
   ```sh
   DATABASE_URL="postgresql://user:password@serverOrIP:port/database"
6. Configure o Prisma com seu banco de dados:
   ```sh
   npx prisma migrate dev
7. Inicie o servidor:
   ```sh
   npm start

### Frontend

1. Navegue até o diretório `frontend`:
   ```sh
   cd frontend
2. Instale as dependências:
   ```sh
   npm install
3. Adicione a URL do banco de dados no arquivo `.env`:
   ```sh
   API_BASE_URL=http://serverOrIP:8000/api
4. Inicie o servidor:
   ```sh
   npm start

### Frontend

1. Navegue até o diretório `backend`:
   ```sh
   cd backend
2. Instale as dependências:
   ```sh
   npm test
