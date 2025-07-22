# LOSLC Backend API

A modern, scalable backend API built with Express.js, TypeScript, and Drizzle ORM. Features a comprehensive authentication system, role-based access control (RBAC), and modular architecture.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.1.29 or higher)
- [PostgreSQL](https://postgresql.org) (v14 or higher)
- [Docker](https://docker.com) (optional, for containerized setup)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd loslc-backend

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Configure your environment variables
# Edit .env with your database credentials
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
FRONTEND_PORT=3000
BACKEND_PORT=8000
PG_USER=username
PG_PASSWORD=password
PG_DB=database
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

### Running the Application

```bash
# Development mode (with file watching)
bun run dev

# Production mode
bun run start

# Database operations
bun run db:generate    # Generate migrations
bun run db:migrate     # Apply migrations
bun run db:push        # Push schema directly
bun run db:studio      # Open Drizzle Studio
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── router.ts       # Main API router
│   │       ├── controllers/    # Route handlers
│   │       ├── providers/      # Business logic
│   │       └── dto/           # Data transfer objects
│   ├── core/
│   │   ├── db/
│   │   │   ├── db.ts          # Database configuration
│   │   │   └── schema/        # Database schemas
│   │   ├── security/          # Security utilities
│   │   └── utils/             # Utility functions
│   └── migrations/            # Database migrations
├── drizzle.config.ts          # Drizzle ORM configuration
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

## 🗄️ Database Schema

### User Management

```typescript
// User table with authentication
export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().$defaultFn(() => randId(20)),
  fullname: varchar("fullname", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### Authentication System

- **Login Sessions**: Long-term user sessions (60 days)
- **Auth Sessions**: Short-term authentication tokens (1 day)
- **Account Verification**: Email verification tokens (7 days)
- **OTP**: One-time passwords for 2FA (10 minutes)

### Role-Based Access Control (RBAC)

```typescript
// Roles and permissions system
export const rolesTable = pgTable("roles", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name").unique(),
  description: varchar("description", { length: 255 }),
});

export const permissionsTable = pgTable("permissions", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name").unique(),
  resource: varchar("resource").notNull(),
  resourceId: varchar("resource_id"),
  action: varchar("actions").notNull(),
});
```

## 🔧 Database Operations

### Creating Tables

1. **Define Schema**: Create or modify files in `src/core/db/schema/`
2. **Generate Migration**: `bun run db:generate`
3. **Apply Migration**: `bun run db:migrate`

### Example Migration Workflow

```bash
# After modifying schema files
bun run db:generate

# Review generated migration in src/migrations/
# Apply migration to database
bun run db:migrate

# For development: push schema directly (skips migrations)
bun run db:push
```

### Example Database Queries

```typescript
import { db } from "@/core/db/db";
import { usersTable } from "@/core/db/schema/user";
import { eq, and } from "drizzle-orm";

// Create user
const newUser = await db.insert(usersTable).values({
  fullname: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  hashedPassword: "hashed_password_here",
}).returning();

// Find user by email
const user = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, "john@example.com"))
  .limit(1);

// Update user
await db
  .update(usersTable)
  .set({ verified: true })
  .where(eq(usersTable.id, userId));

// Delete user
await db
  .delete(usersTable)
  .where(eq(usersTable.id, userId));
```

## 🛣️ API Architecture

### Router Configuration

The API uses a modular router structure with versioning:

```typescript
// src/main.ts
import { router as v1Router } from "./api/v1/router";

app.use("/api/v1", v1Router);
```

```typescript
// src/api/v1/router.ts
import { Router } from "express";
import { router as helloWorldRouter } from "./controllers/helloWorld";

export const router = Router();
router.use("/hello-world", helloWorldRouter);
```

### Creating Controllers

Controllers handle HTTP requests and responses:

```typescript
// src/api/v1/controllers/example.ts
import { Router } from "express";
import { exampleProvider } from "../providers/example";
import type { ExampleRequest, ExampleResponse } from "../dto/example";

export const router = Router();

// GET /api/v1/example
router.get("/", async (req, res) => {
  try {
    const result = await exampleProvider.getAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/v1/example
router.post("/", async (req, res) => {
  try {
    const data: ExampleRequest = req.body;
    const result = await exampleProvider.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
});
```

### Creating Providers

Providers contain business logic and database operations:

```typescript
// src/api/v1/providers/example.ts
import { db } from "@/core/db/db";
import { exampleTable } from "@/core/db/schema/example";
import type { ExampleResponse, ExampleRequest } from "../dto/example";

export const exampleProvider = {
  async getAll(): Promise<ExampleResponse[]> {
    return await db.select().from(exampleTable);
  },

  async create(data: ExampleRequest): Promise<ExampleResponse> {
    const [result] = await db
      .insert(exampleTable)
      .values(data)
      .returning();
    return result;
  },

  async getById(id: string): Promise<ExampleResponse | null> {
    const [result] = await db
      .select()
      .from(exampleTable)
      .where(eq(exampleTable.id, id))
      .limit(1);
    return result || null;
  },
};
```

### Data Transfer Objects (DTOs)

DTOs define the shape of request and response data:

```typescript
// src/api/v1/dto/example.ts
export interface ExampleRequest {
  name: string;
  description?: string;
}

export interface ExampleResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Adding New Routes

1. **Create Controller**: Add route handler in `controllers/`
2. **Create Provider**: Add business logic in `providers/`
3. **Create DTO**: Define types in `dto/`
4. **Register Route**: Add to main router in `router.ts`

```typescript
// src/api/v1/router.ts
import { router as exampleRouter } from "./controllers/example";

export const router = Router();
router.use("/hello-world", helloWorldRouter);
router.use("/example", exampleRouter);  // Add new route
```

## 🔐 Security System

### Permission Checking

```typescript
import { PermissionChecker } from "@/core/security/permissions";

// Check user permissions
const permissionChecker = new PermissionChecker(
  db,
  userRoles,
  [
    { resource: "posts", action: "create" },
    { resource: "posts", resourceId: "123", action: "edit" }
  ],
  ["admin", "superadmin"], // Bypass roles
  false // All permissions required (true = any permission)
);

const hasPermission = await permissionChecker.check();
```

### Role Management

```typescript
// Assign role to user
await db.insert(usersRolesTable).values({
  userId: "user123",
  roleId: "role456"
});

// Create permission
await db.insert(permissionsTable).values({
  name: "create_posts",
  resource: "posts",
  action: "create",
  description: "Allow creating new posts"
});
```

## 🐳 Docker Setup

### Development with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/loslc
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: loslc
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend bun run db:migrate

# Stop services
docker-compose down
```

### Backend Dockerfile

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start application
CMD ["bun", "run", "start"]
```

## 🔧 Configuration

### Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/core/db/schema",    // Schema location
  out: "./src/migrations",          // Migration output
  dialect: "postgresql",            // Database type
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,                    // Detailed output
});
```

### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]                  // Path alias for imports
    }
  }
}
```

## 📚 External References

### Core Dependencies

- **[Express.js](https://expressjs.com/)** - Web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[PostgreSQL](https://postgresql.org/)** - Database
- **[Bun](https://bun.sh/)** - JavaScript runtime
- **[TypeScript](https://typescriptlang.org/)** - Type safety

### Development Tools

- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database toolkit
- **[Docker](https://docs.docker.com/)** - Containerization
- **[date-fns](https://date-fns.org/)** - Date utilities

### Useful Resources

- [Drizzle ORM Queries](https://orm.drizzle.team/docs/sql-select)
- [Express.js Routing](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://postgresql.org/docs/)
- [TypeScript Handbook](https://typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
