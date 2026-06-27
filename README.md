# Hero Factory

Plataforma de gestão de heróis — criação, listagem (com busca e paginação), edição e exclusão lógica (soft delete) de heróis.

Desafio técnico com backend em Node.js + TypeScript, front-end em React (em desenvolvimento) e MySQL 8 em container Docker.

## Stack

- **Backend:** Node.js, TypeScript, Express 5
- **Banco de dados:** MySQL 8 (raw queries via `mysql2`, sem ORM)
- **Validação:** Zod
- **Testes:** Jest + Supertest
- **Infra:** Docker / docker-compose

## Arquitetura

src/
├── domain/ #Entidades e contratos
│ ├── entities/
│ └── repositories/ #IHeroRepository (abstração usada por service)
├── application/ #Regras de negócio
│ ├── dtos/
│ ├── errors/
│ ├── services/ #HeroService (contendo lógica de negócio)
│ └── validators/ #Schemas de validação de entrada
├── infra/ #Implementações
│ ├── database/
│ └── repositories/ #HeroRepository chamando IHeroRepository
├── presentation/ #Camada HTTP
│ ├── controllers/
│ ├── middlewares/
│ └── routes/
├── main/ #Composição de dependências (factories)
└── server.ts

Camadas internas (`domain`, `application`) nunca importam de camadas externas (`infra`, `presentation`).
`HeroService` depende da interface `IHeroRepository`, permitindo trocar base de dados sem impactar regra de negócio (Princípio de Inversão de Dependência).

## Decisões técnicas

- **Raw queries em vez de ORM**: controle sobre formato de retorno exigido (datas em `YYYY-MM-DD HH:mm:ss`, sem timezone), resolvido via `DATE_FORMAT()` direto no SQL.
- **"Excluir" a partir de soft delete**: `DELETE /api/v1/heroes/:id` não remove o registro, apenas altera `is_active = false`, baseando-se em campo `is_active` e funcionalidade requerida para inativação/ativação de herói.
- **Reativação como sub-rota**: `PATCH /api/v1/heroes/:id/reactivate`, deixando rota explícita em URL, evitando sobrecarga em `PATCH /:id`.
- **Validação na borda**: o corpo da requisição é validado via schema Zod antes de chegar ao controller/service. Camada de negócio já recebe dados em formato esperado.

## Como rodar

```bash
# 1. Banco de dados
cd hero-factory-backend
docker-compose up -d   # MySQL 8 na porta 3306, tabela criada automaticamente

# 2. Variáveis de ambiente
cp .env.example .env

# 3. Dependências
npm install

# 4. Rodar em desenvolvimento
npm run dev             # http://localhost:3333

# 5. Testes
npm test
npm run test:coverage
```

> Os testes de integração (`HeroController.test.ts`) batem na API real e exigem o MySQL do passo 1 rodando.

## Endpoints

| Método | Rota                            | Descrição                                             |
| ------ | ------------------------------- | ----------------------------------------------------- |
| POST   | `/api/v1/heroes`                | Cria um herói                                         |
| GET    | `/api/v1/heroes?page=&search=`  | Lista heróis (10 por página, busca por nome/codinome) |
| GET    | `/api/v1/heroes/:id`            | Detalhes de um herói                                  |
| PATCH  | `/api/v1/heroes/:id`            | Edita um herói (bloqueado se inativo)                 |
| DELETE | `/api/v1/heroes/:id`            | Desativa um herói (soft delete)                       |
| PATCH  | `/api/v1/heroes/:id/reactivate` | Reativa um herói desativado                           |

## Próximos passos

- Front-end em React + TypeScript.
- Índice composto em `(is_active, created_at)` e índice de busca em `name`/`nickname`.
- Documentação interativa via Swagger/OpenAPI.
- Banco dedicado para testes de integração.
