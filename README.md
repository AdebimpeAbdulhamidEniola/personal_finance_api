# Personal Finance API (FinAI)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](#)

> **FinAI** is a backend service for managing personal finances, providing secure user authentication, transaction tracking, reporting, and AI-powered insights and budgeting.

---

## Table of Contents
1. [What the project does](#what-the-project-does)
2. [Why it’s useful](#why-the-project-is-useful)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Database Setup](#database-setup)
   - [Running the Server](#running-the-server)
   - [Usage Examples](#usage-examples)
5. [Support & Documentation](#support--documentation)
6. [Maintainers & Contributing](#maintainers--contributing)

---

## What the project does

FinAI exposes a RESTful API to help users manage their personal finances. Core capabilities include:

- **User authentication** (email/password, Google via Firebase)
- **Email verification** using SendGrid
- **CRUD operations** on financial transactions
- **Monthly reports and charts** for income vs expenses and category spending
- **AI-generated financial insights and budgeting** via OpenAI's LLMs
- **Secure JWT-based session handling** with extensible middleware

The service is written in TypeScript and built on top of Express, backed by a PostgreSQL database managed through Prisma.

## Why the project is useful

- **Lightweight and modular** backend for finance apps or dashboards
- **AI features** offer actionable suggestions without building ML pipelines
- **Plug‑and‑play authentication** supports both traditional and OAuth flows
- **Clear separation of concerns** makes it easy to extend (new endpoints, providers)
- **Developer-friendly** with TypeScript types, Zod validation, and Prisma schema

## Architecture & Technology Stack

- **Runtime / Framework**: Node.js, Express 5
- **Language**: TypeScript (compiled via `tsc` / `tsx` for dev)
- **ORM**: Prisma with PostgreSQL (`schema.prisma` defines `User` & `Transaction` models)
- **Validation**: Zod schemas (`src/schema/*`) used by middleware
- **Auth**: JWT tokens (`src/utils/auth.utils.ts`), Firebase for Google
- **Email**: SendGrid (wrapped in `src/services/email.services.ts`)
- **AI**: OpenAI / Vertex AI through `@google-cloud/vertexai` and `openai` clients
- **Logging & env**: Morgan, dotenv
- **API structure**: routers in `src/routes`, controllers in `src/controllers`, models in `src/models`
- **Middleware**: authentication, validation, error handling

> **Architectural decisions:**
> 1. **Modular service layers** keep controller logic thin and testable.
> 2. **Prisma** for type-safe DB access and easy migrations.
> 3. **Zod** for runtime schema validation ensures safety at boundaries.
> 4. **JWT** chosen for stateless auth with token expiry.
> 5. **AI endpoints** decoupled via `services/ai.services.ts` to allow swapping providers.


## Getting Started

### Prerequisites

- Node.js 18+ (or compatible)
- npm / yarn
- PostgreSQL database
- A SendGrid account (for email)
- An OpenAI/GROQ API key or Vertex AI credentials
- Firebase project (for Google auth)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url> personal_finance_api
cd personal_finance_api
npm install
```

### Environment Variables

Copy `.env.example` (if present) or create a `.env` file with at least the following:

```ini
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/financedb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
SENDGRID_API_KEY=...
FROM_EMAIL=you@example.com
BASE_URL=http://localhost:3000
GROQ_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

> **Note:** `.env` is not committed; ensure you do not leak secrets.

### Database Setup

Prisma is used for migrations and seeding.

```bash
# generate client
npx prisma generate

# apply migrations (development)
npm run prisma migrate dev --name init

# optional: seed data
npm run prisma db seed
```

The schema is located at `prisma/schema.prisma` and contains simple models for `User` and `Transaction`. Adjust as needed.

### Running the Server

Development mode (auto-restarts with `tsx`):

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

The API will listen on the port defined in `PORT` or `3000` by default.

### Usage Examples

Below are a few representative curl examples. Full API docs should be maintained separately (e.g. Swagger, Postman, or a docs site).

#### Sign up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Secret123","confirmPassword":"Secret123"}'
```

#### Log in

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret123"}'
```

#### Create transaction (authenticated)

```bash
TOKEN=<jwt-from-login>
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":45.0,"category":"Food","type":"EXPENSE","description":"Lunch"}'
```

#### Get AI insights

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/ai/insights
```


## Support & Documentation

- Search or open issues on this repository
- Review `src/` code and inline comments
- See `docs/` (if present) or wiki pages for extended guides
- Contact maintainers via project communication channels (email/Slack/etc.)

> For API reference, generate Swagger or consult `src/routes` and controllers directly.

## Maintainers & Contributing

Maintained by the original author(s) of the `personal_finance_api` project.
Feel free to submit pull requests or open issues.

- **Lead maintainer:** _Name or handle if known_ (update accordingly)

Please see [`CONTRIBUTING.md`](docs/CONTRIBUTING.md) for guidelines on contributing,
and refer to `CODE_OF_CONDUCT.md` if available.

---

Thanks for checking out FinAI – build something great with it! 🎯
