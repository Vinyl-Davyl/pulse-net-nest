# Pulse-Net (NestJS)

Media sharing API — JWT auth, TypeORM, PostgreSQL, ImageKit uploads.

## Stack

| Layer    | Technology        |
| -------- | ----------------- |
| API      | NestJS, Express   |
| Auth     | Passport JWT      |
| ORM      | TypeORM           |
| Database | PostgreSQL        |
| Media    | ImageKit          |
| Docs     | Swagger at `/api` |

## Architecture

```
src/
├── main.ts              # Bootstrap + Swagger
├── app.module.ts        # Root module wiring
├── core/                # Config + TypeORM
├── auth/                # Register, login, JWT
├── users/               # User entity + /users/me
├── posts/               # Upload, feed, delete
└── media/               # ImageKit client
```

## Setup

```bash
npm install
cp .env.example .env   # fill JWT_SECRET (32+ chars) and ImageKit keys
docker compose up -d db
npm run start:dev
```

## API

| Method | Path                   | Auth   | Description            |
| ------ | ---------------------- | ------ | ---------------------- |
| POST   | `/auth/register`       | —      | Create account         |
| POST   | `/auth/jwt/login`      | —      | Issue JWT              |
| GET    | `/users/me`            | Bearer | Current user           |
| POST   | `/upload`              | Bearer | Upload media + caption |
| GET    | `/feed?limit=&offset=` | Bearer | Paginated feed         |
| DELETE | `/posts/:postId`       | Bearer | Delete own post        |

## Full stack (Docker)

```bash
docker compose up -d --build
```

## Tests

```bash
npm run test
npm run test:e2e
```
