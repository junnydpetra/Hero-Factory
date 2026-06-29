# Hero Factory

Plataforma de gestão de heróis — criação, listagem (com busca e paginação), edição e exclusão lógica (soft delete) de heróis.Desafio técnico full stack: backend em Node.js + TypeScript, front-end em React + TypeScript, e MySQL 8 em container Docker.

## Stack

**Backend**

- Node.js, TypeScript, Express 5
- MySQL 8 (raw queries via `mysql2`, sem ORM)
- Validação: Zod
- Testes: Jest + Supertest

**Frontend**

- React 19 + TypeScript + Vite
- Tailwind CSS
- Axios (consumo da API)
- React Hot Toast (mensagens de sucesso/erro)
- React Router DOM

**Infra**

- Docker / docker-compose (MySQL 8)

## Arquitetura

### Backend

```
hero-factory-backend/src/
├── domain/                # Entidades e contratos
│   ├── entities/
│   └── repositories/      # IHeroRepository (abstração usada pelo service)
├── application/           # Regras de negócio
│   ├── dtos/
│   ├── errors/
│   ├── services/          # HeroService (lógica de negócio)
│   └── validators/        # Schemas de validação de entrada (Zod)
├── infra/                 # Implementações concretas
│   ├── database/
│   └── repositories/      # HeroRepository implementa IHeroRepository
├── presentation/          # Camada HTTP
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── main/                  # Composição de dependências (factories)
└── server.ts
```

Camadas internas (`domain`, `application`) nunca importam de camadas externas (`infra`, `presentation`). O `HeroService` depende da interface `IHeroRepository`, permitindo trocar a implementação de persistência sem impactar a regra de negócio (Dependency Inversion Principle).

### Frontend

```
hero-factory-frontend/src/
├── components/
│   ├── HeroCard.tsx        # Card individual (ações: editar / excluir / ativar)
│   ├── HeroGrid.tsx        # Grid responsivo (5 cards por linha)
│   └── Modals/
│       ├── ModalBase.tsx
│       ├── CreateHeroModal.tsx
│       ├── EditHeroModal.tsx
│       ├── HeroDetailsModal.tsx
│       └── ConfirmModal.tsx
├── context/
│   └── HeroContext.tsx     # Estado global da listagem (heróis, página, busca)
├── hooks/
│   └── useDebounce.ts      # Debounce da busca por nome/codinome
├── pages/
│   └── Dashboard.tsx       # Tela única da aplicação
├── services/
│   ├── api.ts               # Instância do Axios
│   └── heroService.ts        # Chamadas REST (create/list/update/delete/reactivate)
└── types/
    └── Hero.ts
```

## Decisões técnicas

- **Raw queries em vez de ORM**: controle total sobre o formato exato de retorno exigido pelo contrato (datas em `YYYY-MM-DD HH:mm:ss`, sem timezone), resolvido via `DATE_FORMAT()` direto no SQL.
- **"Excluir" como soft delete**: `DELETE /api/v1/heroes/:id` não remove o registro, apenas marca `is_active = false` — leitura baseada na existência do campo `is_active` no contrato e na regra de reativação.
- **Reativação como sub-rota**: `PATCH /api/v1/heroes/:id/reactivate`, deixando a intenção explícita na URL em vez de sobrecarregar um `PATCH /:id` genérico.
- **Validação na borda (backend)**: o corpo da requisição passa por um schema Zod antes de chegar ao controller/service.
- **React + Vite**: por ser uma aplicação em tela única sem necessidade de SSR, com todas as interações client-side (modais, busca e paginação).

## Como rodar

### Backend

````bash
# 1. Subir o container do MySQL
cd hero-factory-backend
docker-compose up -d

# 2. Criar as tabelas no banco de desenvolvimento E no banco de testes
# (Aguarde alguns segundos após subir o container para o MySQL iniciar)
docker exec -i hero_factory_db mysql -u hero_user -phero_password hero_factory < src/infra/database/migrations/create_heroes_table.sql
docker exec -i hero_factory_db mysql -u hero_user -phero_password hero_factory_test < src/infra/database/migrations/create_heroes_table.sql

# 3. Instalar dependências e rodar a API
cp .env.example .env
npm install
npm run dev                # http://localhost:3333

# 4. Rodar os testes (em um terminal separado ou após parar o dev)
npm test                   # Executa os 19 testes da suíte (requer banco de testes criado)
npm run test:coverage      # Gera relatório de cobertura de código (92.3%)

### Frontend

```bash
cd hero-factory-frontend
cp .env.example .env       # VITE_API_URL=http://localhost:3333/api/v1
npm install
npm run dev                 # http://localhost:5173
````

## Endpoints

| Método | Rota                            | Descrição                                             |
| ------ | ------------------------------- | ----------------------------------------------------- |
| POST   | `/api/v1/heroes`                | Cria um herói                                         |
| GET    | `/api/v1/heroes?page=&search=`  | Lista heróis (10 por página, busca por nome/codinome) |
| GET    | `/api/v1/heroes/:id`            | Detalhes de um herói                                  |
| PATCH  | `/api/v1/heroes/:id`            | Edita um herói (bloqueado se inativo)                 |
| DELETE | `/api/v1/heroes/:id`            | Desativa um herói (soft delete)                       |
| PATCH  | `/api/v1/heroes/:id/reactivate` | Reativa um herói desativado                           |

## Funcionalidades implementadas

- [x] CRUD completo de heróis (criação, listagem, edição, exclusão por inativação)
- [x] Listagem ordenada por `created_at` (mais recentes primeiro)
- [x] Heróis inativos exibidos em escala de cinza
- [x] Menu de ações por herói: Editar/Excluir (se ativo) ou Ativar (se inativo)
- [x] Modais de confirmação para exclusão e reativação
- [x] Edição bloqueada para heróis desativados (validado no front e no back)
- [x] Busca por nome ou nome de guerra
- [x] Paginação (10 registros por página, 5 por linha)
- [x] Modal de detalhes ao clicar no herói
- [x] Loading em todas as interações assíncronas
- [x] Mensagens de sucesso/erro (toast) em todas as ações
- [x] Sem autenticação

## Diferenciais técnicos implementados

- ✅ **Testes automatizados de frontend**: Vitest + Testing Library configurados e rodando com sucesso (exemplo: `HeroCard.test.tsx`).
- ✅ **Índices no MySQL**: Adicionados `idx_heroes_active_created` e `idx_heroes_search` para otimizar a paginação e as buscas por nome/apelido, garantindo maior escalabilidade.
- ✅ **Banco dedicado para testes**: Integração com `.env.test` para rodar a suíte de testes em um banco MySQL isolado (`hero_factory_test`), sem poluir o ambiente de desenvolvimento.
- ✅ **Documentação interativa**: Swagger/OpenAPI pré-configurado e disponível em `http://localhost:3333/api-docs`.
