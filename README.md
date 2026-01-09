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

Creer le fichier `.env` avec les variables d'environnement necessaires (copier depuis `.env.example` ou demander au responsable du projet).

Lancer la base de donnees et appliquer les migrations :

```bash
docker-compose up -d
npx prisma migrate dev
```

Demarrer le serveur :

```bash
npm run start:dev
```

### 2. Frontend (event-app)

```bash
cd event-app
npm install
```

Creer le fichier `.env.local` avec les variables d'environnement necessaires.

Demarrer l'application :

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3001
