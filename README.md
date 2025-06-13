# API Check Time

API para gerenciamento de registros de ponto e relatórios.

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
