# LOSLC.tech - Linux & Open-Source Lovers Community Platform

The official web platform for the Linux & Open-Source Lovers Community (LOSL-C), built with Next.js frontend and Express.js backend.

## 🚀 About LOSL-C

LOSL-C is more than just a Linux user group. We're passionate advocates for open-source software, cybersecurity excellence, digital freedom, and technological empowerment across Africa. Our community is dedicated to fostering the next generation of African tech leaders through collaboration, knowledge sharing, and hands-on learning.


### 🏗️ Architecture

```
loslc.tech/
├── frontend/          # Next.js React application
├── backend/           # Express.js API server
├── docker-compose.yml # Multi-service orchestration
└── .env.example       # Environment configuration
```

## ✨ Features

- **🎨 Modern UI/UX** - Built with Next.js, TailwindCSS, and shadcn/ui
- **🔐 Authentication System** - Complete user management with sessions and 2FA
- **👥 Role-Based Access Control** - Flexible permissions and role management
- **📱 Responsive Design** - Mobile-first approach with dark/light themes
- **🗄️ Database Integration** - PostgreSQL with Drizzle ORM
- **🐳 Docker Support** - Containerized development and deployment
- **🔄 API Versioning** - RESTful API with proper versioning
- **🛡️ Security First** - Input validation, sanitization, and secure headers

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- [Bun](https://bun.sh) (v1.1.29 or higher)
- [PostgreSQL](https://postgresql.org) (v14 or higher)
- [Docker](https://docker.com) (optional, recommended)

### 🐳 Quick Setup with Docker

```bash
# Clone the repository
git clone <repository-url>
cd loslc.tech

# Copy environment files
cp .env.example .env

# Start all services
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Database: localhost:5432
```

### 💻 Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd loslc.tech

# Setup Backend
cd backend
cp .env.example .env
bun install
bun run db:migrate
bun run dev

# Setup Frontend (in another terminal)
cd ../frontend
bun install
bun run dev
```

## ⚙️ Environment Configuration

### 🔧 Environment Variables

The application uses multiple environment files for different components:

- **Root `.env`** - Docker Compose and global configuration
- **Backend `.env`** - Backend-specific settings  
- **Frontend `.env.local`** - Frontend-specific settings

### 📝 Required Environment Variables

#### Root Configuration (`.env`)

```bash
# ============================================================================
# 🐳 Docker Compose Configuration
# ============================================================================
FRONTEND_PORT=3000
BACKEND_PORT=8000

# ============================================================================
# 🗄️ Database Configuration
# ============================================================================
PG_USER=loslc_user
PG_PASSWORD=secure_password_here
PG_DB=loslc_database
DATABASE_URL=postgresql://${PG_USER}:${PG_PASSWORD}@db:5432/${PG_DB}

# ============================================================================
# 🌐 Application URLs
# ============================================================================
APP_URL=https://loslc.tech
BACKEND_URL=http://backend:8000  # For Docker, use http://localhost:8000 for local dev

# ============================================================================
# 📧 Email Configuration
# ============================================================================
MAIL_SERVICE=gmail
APP_EMAIL=no-reply@loslc.tech
SADMIN_EMAIL=admin@loslc.tech
SMTP_PASSWORD=your-smtp-app-password-here

# ============================================================================
# 🔐 Security & Authentication
# ============================================================================
OTP_EXPIRATION_MINUTES=10
AUTH_SESSION_EXPIRATION_DAYS=7
EMAIL_VERIFICATION_EXPIRATION_HOURS=24
PASSWORD_RESET_EXPIRATION_MINUTES=30

# ============================================================================
# 🐞 Development
# ============================================================================
DEBUG=true
STORAGE=fs/storage
```

#### Backend Configuration (`backend/.env`)

```bash
# Application settings
APP_URL=https://loslc.tech
PORT=8000
DEBUG=true

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Email configuration
MAIL_SERVICE=gmail
APP_EMAIL=no-reply@loslc.tech
SADMIN_EMAIL=admin@loslc.tech
SMTP_PASSWORD=your-smtp-password

# Authentication timeouts
OTP_EXPIRATION_MINUTES=10
AUTH_SESSION_EXPIRATION_DAYS=7
EMAIL_VERIFICATION_EXPIRATION_HOURS=24
PASSWORD_RESET_EXPIRATION_MINUTES=30

# File storage
STORAGE=fs/storage
```

#### Frontend Configuration (`frontend/.env.local`)

```bash
# Backend API URL
BACKEND_URL=http://localhost:8000
```

### 🔄 Environment Setup Steps

1. **Copy example files:**
   ```bash
   # Root configuration for Docker
   cp .env.example .env
   
   # Backend configuration
   cp backend/.env.example backend/.env
   
   # Frontend configuration  
   cp frontend/.env.example frontend/.env.local
   ```

2. **Update database credentials:**
   - Change `PG_USER`, `PG_PASSWORD`, and `PG_DB` in root `.env`
   - Update `DATABASE_URL` in backend `.env`

3. **Configure email service:**
   - Set up Gmail App Password or other email service
   - Update `SMTP_PASSWORD` and email addresses

4. **Set application URLs:**
   - For development: Use `localhost` URLs
   - For production: Use your domain names

### 🚨 Security Notes

- **Never commit actual credentials** to version control
- **Use strong passwords** for database and email accounts
- **Enable 2FA** on email accounts used for SMTP
- **Use environment-specific URLs** (localhost for dev, domain for prod)
- **Set `DEBUG=false`** in production environments

## 🏗️ Project Structure

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── globals.css      # Global styles
│   │   └── [pages]/         # Additional pages
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── core/            # Core application components
│   │   └── providers/       # Context providers
│   └── lib/
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Backend (Express.js)

```
backend/
├── src/
│   ├── main.ts             # Application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── router.ts   # Main API router
│   │       ├── controllers/ # Route handlers
│   │       ├── providers/   # Business logic
│   │       └── dto/        # Data transfer objects
│   ├── core/
│   │   ├── db/
│   │   │   ├── db.ts       # Database configuration
│   │   │   └── schema/     # Database schemas
│   │   ├── security/       # Security utilities
│   │   └── utils/          # Utility functions
│   └── migrations/         # Database migrations
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json
└── tsconfig.json
```

## 🔧 Development Workflow

### 📋 Development Process Overview

Our development workflow follows a structured approach that ensures type safety, maintainability, and scalability. Here's the recommended process for adding new features:

#### 1. **Database Schema First**
Start by defining your data structure in the database schema:

```typescript
// backend/src/core/db/schema/posts.ts
export const postsTable = pgTable("posts", {
  id: varchar("id").primaryKey().$defaultFn(() => randId(20)),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => usersTable.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### 2. **Generate and Apply Migrations**
```bash
cd backend
bun run db:generate    # Creates migration files
bun run db:migrate     # Applies to database
```

#### 3. **Create DTOs (Data Transfer Objects)**
DTOs are **essential** for type safety and API contracts:

```typescript
// backend/src/api/v1/dto/posts.ts
export interface CreatePostRequest {
  title: string;
  content: string;
  published?: boolean;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  published?: boolean;
}
```

#### 4. **Implement Providers (Business Logic)**
Providers handle database operations and business rules:

```typescript
// backend/src/api/v1/providers/posts.ts
import { db } from "@/core/db/db";
import { postsTable } from "@/core/db/schema/posts";
import type { CreatePostRequest, PostResponse } from "../dto/posts";

export const postsProvider = {
  async create(data: CreatePostRequest, authorId: string): Promise<PostResponse> {
    const [post] = await db
      .insert(postsTable)
      .values({ ...data, authorId })
      .returning();
    return post;
  },

  async getById(id: string): Promise<PostResponse | null> {
    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1);
    return post || null;
  },

  async getAll(published?: boolean): Promise<PostResponse[]> {
    const query = db.select().from(postsTable);
    if (published !== undefined) {
      query.where(eq(postsTable.published, published));
    }
    return await query;
  }
};
```

#### 5. **Create Controllers (API Endpoints)**
Controllers handle HTTP requests and responses:

```typescript
// backend/src/api/v1/controllers/posts.ts
import { Router } from "express";
import { postsProvider } from "../providers/posts";
import type { CreatePostRequest } from "../dto/posts";

export const router = Router();

// GET /api/v1/posts
router.get("/", async (req, res) => {
  try {
    const published = req.query.published === 'true';
    const posts = await postsProvider.getAll(published);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST /api/v1/posts
router.post("/", async (req, res) => {
  try {
    const data: CreatePostRequest = req.body;
    const authorId = req.user?.id; // From auth middleware
    
    const post = await postsProvider.create(data, authorId);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
});
```

#### 6. **Register Routes**
Add new routes to the main router:

```typescript
// backend/src/api/v1/router.ts
import { router as postsRouter } from "./controllers/posts";

export const router = Router();
router.use("/hello-world", helloWorldRouter);
router.use("/posts", postsRouter);  // Add new route
```

#### 7. **Frontend Integration**
Create corresponding types and API calls in the frontend:

```typescript
// frontend/src/types/posts.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

// frontend/src/lib/api/posts.ts
export async function createPost(data: CreatePostRequest): Promise<Post> {
  const response = await fetch('/api/v1/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### 🎯 Why DTOs are Essential

#### **Type Safety Across Layers**
DTOs ensure type consistency between frontend, backend, and database:

```typescript
// ✅ Good: Clear interface contracts
interface UserCreateRequest {
  email: string;
  password: string;
  fullname: string;
}

// ❌ Bad: No type safety
function createUser(data: any) { ... }
```

#### **API Documentation**
DTOs serve as living documentation for your API:

```typescript
// Self-documenting API contracts
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}
```

### 🔄 Development Commands

#### Backend Development

```bash
cd backend

# Install dependencies
bun install

# Start development server with hot reload
bun run dev

# Database operations
bun run db:generate    # Generate migrations
bun run db:migrate     # Apply migrations
bun run db:push        # Push schema directly (dev only)
bun run db:studio      # Open database studio

# Production
bun run start
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
bun run start

# Linting and formatting
bun run lint
```

### 🏗️ Architecture Patterns

#### **Layered Architecture**
```
Frontend (Next.js)
    ↓ HTTP/API calls
Controllers (Express routes)
    ↓ Business logic
Providers (Service layer)
    ↓ Data access
Database (PostgreSQL)
```

#### **Data Flow**
```
1. Frontend sends typed request (DTO)
2. Controller validates and routes
3. Provider processes business logic
4. Database operations with Drizzle
5. Response flows back with typed DTOs
```

### 🛡️ Best Practices

#### **Always Use DTOs**
```typescript
// ✅ Good: Explicit interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

// ❌ Bad: Direct database types in API
function login(user: DatabaseUser) { ... }
```

#### **Separate Concerns**
- **Controllers**: Handle HTTP, validation, auth
- **Providers**: Business logic, data processing
- **Schema**: Database structure and relationships
- **DTOs**: API contracts and type definitions

#### **Error Handling**
```typescript
// Consistent error responses
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, string>;
}
```

#### **Database Migrations**
- Always generate migrations for schema changes
- Never modify existing migrations
- Test migrations in development first
- Use descriptive migration names

### 🚀 Development Tips

1. **Start with the database schema** - Design your data structure first
2. **Use TypeScript everywhere** - Leverage type safety across the stack
3. **Keep DTOs simple** - Focus on API contracts, not business logic
4. **Test your migrations** - Always verify schema changes work
5. **Use Drizzle Studio** - Visual database management and query testing
6. **Follow the workflow** - Schema → Migration → DTO → Provider → Controller
7. **Document your APIs** - DTOs serve as living documentation

## 🗄️ Database Schema

The application uses a comprehensive database schema with:

- **Users Management** - User accounts with authentication
- **Session Handling** - Login and auth sessions
- **Account Verification** - Email verification and OTP
- **Role-Based Access Control** - Roles and permissions system

### Key Tables

- `users` - User accounts and profiles
- `login_sessions` - Long-term user sessions
- `auth_sessions` - Short-term authentication tokens
- `roles` - User roles definition
- `permissions` - Granular permissions
- `users_roles` - User-role associations
- `roles_permissions` - Role-permission mapping

## 🔐 Authentication & Security

### Features

- **Multi-Session Management** - Handle multiple device logins
- **Email Verification** - Secure account activation
- **Two-Factor Authentication** - OTP-based 2FA
- **Role-Based Permissions** - Granular access control
- **Secure Password Handling** - Bcrypt hashing
- **Session Expiration** - Configurable session timeouts

## 🐳 Docker Configuration

### Services

- **Frontend** - Next.js application (Port 3000)
- **Backend** - Express.js API (Port 8000)
- **Database** - PostgreSQL (Port 5432)

### Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Run migrations
docker-compose exec backend bun run db:migrate

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build
```

## 🌍 Environment Configuration

### Root `.env`

```bash
# Application Ports
FRONTEND_PORT=3000
BACKEND_PORT=8000

# Database Configuration
PG_USER=postgres
PG_PASSWORD=password
PG_DB=loslc
DATABASE_URL=postgresql://postgres:password@localhost:5432/loslc

# Additional configuration
NODE_ENV=development
```

### Backend `.env`

```bash
BACKEND_PORT=8000
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

### Frontend `.env`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🎨 Frontend Components

### Core Components

- **Hero Section** - Landing page hero
- **Features** - Product features showcase
- **Testimonials** - User testimonials
- **About Section** - Company information
- **Footer** - Site footer with links
- **Navigation** - Responsive navigation bar

### UI Components (shadcn/ui)

- **Button** - Customizable button component
- **Card** - Content container component
- **Theme Provider** - Dark/light theme support

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
bun run start

# Frontend
cd frontend
bun run build
bun run start
```

## 📊 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Language**: TypeScript
- **Runtime**: Bun

### Backend
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Runtime**: Bun

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📝 Scripts Reference

### Root Level

```bash
# Start all services with Docker
docker-compose up -d

# Stop all services
docker-compose down
```

### Backend Scripts

```bash
bun run dev          # Development server
bun run start        # Production server
bun run db:generate  # Generate migrations
bun run db:migrate   # Apply migrations
bun run db:studio    # Database GUI
```

### Frontend Scripts

```bash
bun run dev          # Development server
bun run build        # Production build
bun run start        # Production server
bun run lint         # Lint code
```

## 🔗 External Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)

### Tools
- [Bun Documentation](https://bun.sh/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://postgresql.org/docs/)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the LOSLC Dev Team**
