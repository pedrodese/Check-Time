# Check Time API

API para registro de ponto de funcionários desenvolvida com NestJS, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- Autenticação de usuários (JWT)
- Gerenciamento de usuários (Admin e Funcionários)
- Registro de ponto (entrada/saída)
- Geração de relatórios em CSV
- Controle de acesso baseado em roles

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [TypeScript](https://www.typescriptlang.org/)

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/check-time.git
cd check-time
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/check_time?schema=public"
JWT_SECRET="seu_jwt_secret"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run start:dev
```

## 📚 Documentação da API

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

### Usuários

#### Criar Usuário (Admin)
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456",
  "role": "EMPLOYEE"
}
```

### Registros de Ponto

#### Registrar Ponto (Funcionário)
```http
POST /time-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "ENTRY"
}
```

#### Listar Todos os Registros (Admin)
```http
GET /time-records
Authorization: Bearer <token>
```

#### Listar Registros de um Funcionário (Admin)
```http
GET /time-records/employee/:id
Authorization: Bearer <token>
```

### Relatórios

#### Gerar Relatório CSV (Admin)
```http
GET /reports/generate?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer <token>
```

## 🔐 Roles e Permissões

- **ADMIN**: Acesso total à API
  - Gerenciar usuários
  - Visualizar todos os registros
  - Gerar relatórios

- **EMPLOYEE**: Acesso limitado
  - Registrar ponto
  - Visualizar próprios registros

## 🧪 Testes

Para executar os testes:
```bash
npm run test
```

## 📦 Coleção Postman

Uma coleção do Postman está disponível no arquivo `check-time-api.postman_collection.json`. Importe-a no Postman para testar todos os endpoints.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
