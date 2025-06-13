# Check Time API

API RESTful para sistema de controle de ponto eletrônico desenvolvida com NestJS.

## Documentação dos Endpoints

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "registration": "112233",
    "password": "123456"
}
```

**Resposta (200 OK)**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
        "registration": "112233",
        "name": "João Silva",
        "role": "employee"
    }
}
```

### Usuários

#### Criar Primeiro Admin
```http
POST /users/first-admin
Content-Type: application/json

{
    "registration": "123456",
    "name": "Admin",
    "password": "123456",
    "role": "admin",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00"
}
```

**Resposta (201 Created)**
```json
{
    "id": "a2ec5950-4d08-4c85-aa27-83ebdf06a3b6",
    "registration": "123456",
    "name": "Admin",
    "role": "admin",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00",
    "createdAt": "2025-06-13T21:14:52.881Z",
    "updatedAt": "2025-06-13T21:14:52.881Z"
}
```

#### Criar Usuário - Funcionario (Apenas Admin)
```http
POST /users
Content-Type: application/json
Authorization: Bearer {token}

{
    "registration": "112233",
    "name": "João Silva",
    "password": "123456",
    "role": "employee",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00"
}
```

**Resposta (201 Created)**
```json
{
    "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
    "registration": "112233",
    "name": "João Silva",
    "role": "employee",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00",
    "createdAt": "2025-06-13T22:26:44.990Z",
    "updatedAt": "2025-06-13T22:26:44.990Z"
}
```

#### Obter Perfil do Usuário Logado
```http
GET /users/profile
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
{
    "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
    "registration": "112233",
    "name": "João Silva",
    "role": "employee",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00",
    "createdAt": "2025-06-13T22:26:44.990Z",
    "updatedAt": "2025-06-13T22:26:44.990Z"
}
```

#### Listar Todos os Usuários (Apenas Admin)
```http
GET /users
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
[
    {
        "id": "a2ec5950-4d08-4c85-aa27-83ebdf06a3b6",
        "registration": "123456",
        "name": "Admin",
        "role": "admin",
        "createdAt": "2025-06-13T21:14:52.881Z",
        "updatedAt": "2025-06-13T21:14:52.881Z"
    },
    {
        "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
        "registration": "112233",
        "name": "João Silva",
        "role": "employee",
        "createdAt": "2025-06-13T22:26:44.990Z",
        "updatedAt": "2025-06-13T22:26:44.990Z"
    }
]
```

#### Buscar Usuário por ID (Apenas Admin)
```http
GET /users/:id
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
{
    "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
    "registration": "112233",
    "name": "João Silva",
    "role": "employee",
    "morningEntry": "08:00",
    "morningExit": "12:00",
    "afternoonEntry": "13:00",
    "afternoonExit": "17:00",
    "createdAt": "2025-06-13T22:26:44.990Z",
    "updatedAt": "2025-06-13T22:26:44.990Z"
}
```

#### Atualizar Usuário (Apenas Admin)
```http
PUT /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "João Silva Atualizado",
    "morningEntry": "09:00",
    "morningExit": "13:00",
    "afternoonEntry": "14:00",
    "afternoonExit": "18:00"
}
```

**Resposta (200 OK)**
```json
{
    "id": "f8f335b4-f84e-4e9d-8a0b-1160074b0804",
    "registration": "112233",
    "name": "João Silva Atualizado",
    "role": "employee",
    "morningEntry": "09:00",
    "morningExit": "13:00",
    "afternoonEntry": "14:00",
    "afternoonExit": "18:00",
    "createdAt": "2025-06-13T22:26:44.990Z",
    "updatedAt": "2025-06-13T22:26:44.990Z"
}
```

#### Remover Usuário (Apenas Admin)
```http
DELETE /users/:id
Authorization: Bearer {token}
```

**Resposta (200 OK)**
```json
{
    "message": "Usuário removido com sucesso"
}
```

### Códigos de Status

- 200: Sucesso
- 201: Criado
- 400: Requisição inválida
- 401: Não autorizado
- 403: Proibido
- 404: Não encontrado
- 409: Conflito (ex: matrícula já cadastrada)
- 500: Erro interno do servidor

### Autenticação

Todos os endpoints (exceto login e criação do primeiro admin) requerem autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer seu-token-jwt
```

### Roles (Papéis)

- `admin`: Acesso total ao sistema
- `employee`: Acesso limitado ao próprio perfil e registros de ponto
