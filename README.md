# Event App

Application de gestion d'evenements avec un frontend Next.js et un backend NestJS.

## Prerequis

- Node.js (v18+)
- Docker

## Installation

### 1. Backend (nest-api)

```bash
cd nest-api
npm install
```

Creer le fichier `.env` avec les variables d'environnement suivantes :

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestdb?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3001
```

Lancer la base de donnees et appliquer les migrations :

```bash
docker compose up -d
npx prisma migrate reset --force
```

Demarrer le serveur :

```bash
npm run start:dev
```

L'API sera accessible sur http://localhost:3001

### 2. Frontend (event-app)

```bash
cd event-app
npm install
```

Creer le fichier `.env.local` avec :

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Demarrer l'application :

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000
