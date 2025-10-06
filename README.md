# Maglo - Full Stack Application

A modern full-stack application built with NestJS, GraphQL, Drizzle ORM, PostgreSQL, React, React Query, and Tailwind CSS.

## 🏗️ Architecture

This project follows a monorepo structure with the following organization:

```
maglo/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # React web application
├── packages/
│   ├── shared/           # Shared TypeScript types and utilities
│   └── config/           # Configuration utilities
└── docs/                 # Documentation
```

## 🚀 Tech Stack

### Backend
- **NestJS** - Scalable Node.js framework
- **GraphQL** - Query language and API
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI library
- **React Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo Client** - GraphQL client
- **React Router** - Client-side routing
- **TypeScript** - Type safety

### Development Tools
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Frontend build tool

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (optional)
- PostgreSQL (if not using Docker)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd maglo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```bash
# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
```

### 4. Database setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
npm run docker:dev
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `maglo_dev`
3. Update the `DATABASE_URL` in your `.env` file

### 5. Database migration

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

### 6. Start development servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on http://localhost:4000
npm run dev:frontend # Frontend on http://localhost:3000
```

## 📚 API Documentation

### GraphQL Playground

Once the backend is running, you can access the GraphQL Playground at:
- http://localhost:4000/graphql

### Authentication Endpoints

#### Register User
```graphql
mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    access_token
    user {
      id
      email
      username
      firstName
      lastName
    }
  }
}
```

#### Login User
```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    access_token
    user {
      id
      email
      username
      firstName
      lastName
    }
  }
}
```

#### Get Users (Protected)
```graphql
query GetUsers {
  users {
    id
    email
    username
    firstName
    lastName
    isActive
    isVerified
    createdAt
    updatedAt
  }
}
```

## 🐳 Docker Deployment

### Development

```bash
# Start all services in development mode
npm run docker:dev
```

### Production

```bash
# Build and start production containers
npm run docker:prod
```

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all applications
- `npm run lint` - Lint all applications
- `npm run format` - Format code with Prettier
- `npm run docker:dev` - Start development environment with Docker
- `npm run docker:prod` - Start production environment with Docker

### Backend Specific
- `npm run dev:backend` - Start backend in development mode
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

### Frontend Specific
- `npm run dev:frontend` - Start frontend in development mode

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Client stores token and includes it in subsequent requests
4. Server validates token for protected routes

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚦 Frontend Routing

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Protected dashboard (requires authentication)

## 🎨 Styling

The frontend uses Tailwind CSS with a custom configuration:

- **Primary colors**: Blue palette
- **Typography**: Inter font family
- **Responsive design**: Mobile-first approach

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## 📦 Project Structure

```
apps/backend/src/
├── modules/
│   ├── auth/           # Authentication module
│   └── users/          # Users module
├── database/           # Database configuration and schema
├── common/             # Shared utilities and decorators
├── app.module.ts       # Main application module
└── main.ts            # Application entry point

apps/frontend/src/
├── components/         # Reusable React components
├── pages/             # Page components
├── store/             # Redux store and slices
├── graphql/           # GraphQL queries and client
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── App.tsx            # Main application component

packages/shared/src/
├── types.ts           # Shared TypeScript types
└── utils.ts           # Shared utility functions

packages/config/src/
└── index.ts           # Configuration utilities
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 4000)
- `FRONTEND_URL` - Frontend URL for CORS

#### Frontend
- `VITE_GRAPHQL_URL` - GraphQL API endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database credentials

2. **Port already in use**
   - Change PORT in .env file
   - Kill existing processes using the port

3. **Dependencies installation failed**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Run `npm install` again

4. **TypeScript errors**
   - Run `npm run type-check` to see detailed errors
   - Ensure all dependencies are installed
   - Check tsconfig.json configuration

### Getting Help

- Open an issue on GitHub
- Check the documentation
- Review the GraphQL schema in the playground

## 🗺️ Roadmap

- [ ] Add comprehensive test suite
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Create admin dashboard
- [ ] Add real-time features with WebSockets
- [ ] Implement file upload functionality
- [ ] Add API rate limiting
- [ ] Create mobile app with React Native