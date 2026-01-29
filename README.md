# 🛡️ Auth Service (Hono + Prisma)

A **production-grade authentication and authorization microservice** built with **HonoJS**, **Prisma**, and **TypeScript**.  
Designed for **high performance**, **strong typing**, **clean error contracts**, and **enterprise-level observability**.

---

## ✨ Key Features

- 🔐 Authentication & Authorization (RBAC-ready)
- 🧱 Centralized, typed error handling with error codes
- 📊 Structured JSON logging
- 🧵 Request tracing using AsyncLocalStorage
- 🧩 Prisma → domain error mapping (no DB leaks)
- 🧪 Fully testable with Postman & CI-friendly
- ⚡ Ultra-fast Hono framework (Node.js runtime)

---

## 🛠️ Tech Stack

- **Framework:** [Hono](https://hono.dev/) – ultra-fast web framework
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Runtime:** Node.js (`@hono/node-server`)
- **Language:** TypeScript
- **Dev Tooling:** `tsx`
- **Security:** `bcryptjs`
- **Logging:** Structured JSON logs (stdout-friendly)

---

## 📂 Project Structure
src/
├─ app.ts # Hono app & middleware wiring
├─ prisma.ts # Prisma client
├─ middleware/
│ ├─ auth.middleware.ts # Authentication (401)
│ ├─ role.middleware.ts # Authorization (403)
│ ├─ error-handler.ts # Global error handler
│ └─ request-context.middleware.ts
├─ errors/
│ ├─ base-app.error.ts # AppError base class
│ └─ auth.error.ts # Auth, AuthZ, validation errors
├─ services/
│ └─ permission.service.ts
├─ logger.ts # Structured logger
├─ request-context.ts # AsyncLocalStorage
└─ index.ts # Server entry point

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

- Node.js **v20+**
- PostgreSQL running locally or remotely

---

### 2️⃣ Installation

```bash
npm install
```
### 3️⃣ Environment Setup

Create a .env file in the root directory:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/auth_db?schema=public"
PORT=3000
```
### 4️⃣ Database Initialization
```bash
npx prisma generate
npm run dbDeploy
```
### 5️⃣ Run the Server
```bash
npm run dev
```
Server starts at:
http://localhost:3000

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start server in watch mode (tsx) |
| `npm run build`    | Compile TypeScript into `dist/`  |
| `npm run start`    | Run production build             |
| `npm run dbDeploy` | Apply Prisma migrations          |

🧱 Error Handling Philosophy

All errors are typed, centralized, and safe.
Error Response Format
```bash
{
  "success": false,
  "message": "Authentication required",
  "errorCode": "AUTH_001",
  "requestId": "uuid"
}
```
🧵 Request Tracing
- Each request gets a unique requestId via AsyncLocalStorage.
- Returned in every API response
- Included in all logs
- Enables full request ↔ log correlation

📊 Logging
All logs are structured JSON:
```bash
{
  "level": "error",
  "message": "Operational error",
  "errorCode": "AUTHZ_PERM_404",
  "requestId": "uuid",
  "timestamp": "2026-01-13T12:00:00.000Z"
}
```
Logs are compatible with:
- ELK Stack
- Datadog
- CloudWatch
- GCP Logging

🔐 Security Principles
- No raw Error thrown from services
- No stack traces in responses
- Auth & RBAC enforced via middleware
- Error codes as stable API contracts  
  
🏆 Engineering Principles
- Explicit > implicit
- Errors are part of the API contract
- Middleware handles cross-cutting concerns
- Routes stay boring

📌 Future Enhancements
- OpenAPI / Swagger docs
- JWT refresh token rotation
- OpenTelemetry tracing
- Rate limiting middleware
- CI test automation (Newman / Jest)

🤝 Contributing
- PRs are welcome.
Please ensure:
- Typed errors only
- No console.log
- Postman tests updated for new endpoints
- Advanced REGEX for Email:
  ```
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
```

