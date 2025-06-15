# Check Time - Sistema de Registro de Ponto

Sistema completo para gerenciamento de registros de ponto e relatórios, composto por uma API REST (NestJS) e uma aplicação web (Next.js).

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- `check-time-api`: Backend em NestJS
- `check-time-web`: Frontend em Next.js

## Pré-requisitos

- Node.js 18 ou superior
- Docker e Docker Compose
- PostgreSQL (opcional, caso não queira usar Docker)

## Configuração e Execução

### 1. Banco de Dados

O projeto utiliza PostgreSQL como banco de dados. Você pode executá-lo de duas formas:

#### Usando Docker (Recomendado)

```bash
# Na pasta check-time-api
docker-compose up -d
```

Isso irá:
- Criar um container PostgreSQL
- Configurar o banco de dados com as credenciais padrão
- Expor a porta 5432
- Criar um volume persistente para os dados

#### Usando PostgreSQL Local

Se preferir usar uma instalação local do PostgreSQL, certifique-se de:
1. Ter o PostgreSQL instalado
2. Criar um banco de dados chamado `check_time`
3. Configurar as variáveis de ambiente conforme necessário

### 2. Backend (API)

```bash
# Na pasta check-time-api
npm install
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

### 3. Frontend (Web)

```bash
# Na pasta check-time-web
npm install
npm run dev
```

A aplicação web estará disponível em `http://localhost:3001`

## Variáveis de Ambiente

### API (.env na pasta check-time-api)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=check_time
JWT_SECRET=seu_jwt_secret_aqui
```

### Web (.env na pasta check-time-web)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Autenticação

Todos os endpoints (exceto o login) requerem autenticação via JWT. O token deve ser enviado no header `Authorization: Bearer <token>`.

### Endpoints de Autenticação

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "registration": "string (6 dígitos)",
    "password": "string"
  }
  ```
- **Resposta:** Token JWT para autenticação

## Usuários

### Endpoints de Usuários

#### Criar Primeiro Administrador
- **POST** `/users/first-admin`
- **Body:**
  ```json
  {
    "registration": "string (6 dígitos)",
    "name": "string",
    "password": "string (mínimo 6 caracteres)",
    "morningEntry": "string (HH:mm)",
    "morningExit": "string (HH:mm)",
    "afternoonEntry": "string (HH:mm)",
    "afternoonExit": "string (HH:mm)"
  }
  ```
- **Acesso:** Público

#### Criar Usuário
- **POST** `/users`
- **Body:**
  ```json
  {
    "registration": "string (6 dígitos)",
    "name": "string",
    "password": "string (mínimo 6 caracteres)",
    "role": "ADMIN" | "EMPLOYEE",
    "morningEntry": "string (HH:mm)",
    "morningExit": "string (HH:mm)",
    "afternoonEntry": "string (HH:mm)",
    "afternoonExit": "string (HH:mm)"
  }
  ```
- **Acesso:** Apenas Administradores

#### Obter Perfil
- **GET** `/users/profile`
- **Acesso:** Usuário autenticado

#### Listar Todos os Usuários
- **GET** `/users`
- **Acesso:** Apenas Administradores

#### Obter Usuário por ID
- **GET** `/users/:id`
- **Acesso:** Apenas Administradores

#### Atualizar Usuário
- **PUT** `/users/:id`
- **Body:**
  ```json
  {
    "registration": "string (6 dígitos)",
    "name": "string",
    "password": "string (mínimo 6 caracteres)",
    "role": "ADMIN", "EMPLOYEE",
    "morningEntry": "string (HH:mm)",
    "morningExit": "string (HH:mm)",
    "afternoonEntry": "string (HH:mm)",
    "afternoonExit": "string (HH:mm)"
  }
  ```
- **Acesso:** Apenas Administradores

#### Remover Usuário
- **DELETE** `/users/:id`
- **Acesso:** Apenas Administradores

## Registros de Tempo

### Endpoints de Registros de Tempo

#### Criar Registro
- **POST** `/time-records`
- **Body:**
  ```json
  {
    "type": "MORNING_ENTRY", "MORNING_EXIT", "AFTERNOON_ENTRY", "AFTERNOON_EXIT"
  }
  ```
- **Acesso:** Apenas Funcionários
- **Descrição dos tipos:**
  - `MORNING_ENTRY`: Entrada no período da manhã
  - `MORNING_EXIT`: Saída no período da manhã
  - `AFTERNOON_ENTRY`: Entrada no período da tarde
  - `AFTERNOON_EXIT`: Saída no período da tarde

#### Obter Meus Registros
- **GET** `/time-records/my-records`
- **Query Params:**
  - `date`: Data no formato YYYY-MM-DD
- **Acesso:** Apenas Funcionários

#### Listar Todos os Registros
- **GET** `/time-records`
- **Query Params:**
  - `date`: Data no formato YYYY-MM-DD
- **Acesso:** Apenas Administradores

## Relatórios

### Endpoints de Relatórios

#### Gerar Relatório
- **GET** `/reports/generate`
- **Query Params:**
  - `startDate`: Data inicial no formato YYYY-MM-DD
  - `endDate`: Data final no formato YYYY-MM-DD
- **Resposta:** Arquivo CSV com relatório
- **Acesso:** Apenas Administradores

## Configuração do Banco de Dados

A API utiliza PostgreSQL como banco de dados. As configurações podem ser definidas através das seguintes variáveis de ambiente:

- `DB_HOST`: Host do banco de dados (padrão: localhost)
- `DB_PORT`: Porta do banco de dados (padrão: 5432)
- `DB_USERNAME`: Usuário do banco de dados (padrão: postgres)
- `DB_PASSWORD`: Senha do banco de dados (padrão: postgres)
- `DB_DATABASE`: Nome do banco de dados (padrão: check_time)

## Segurança

- A API utiliza JWT para autenticação
- As senhas são armazenadas com hash
- Existe controle de acesso baseado em roles (ADMIN e EMPLOYEE)
- Todas as rotas (exceto login e criação do primeiro admin) requerem autenticação
