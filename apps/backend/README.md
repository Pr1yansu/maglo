# Backend Documentation

## Overview

The backend is built with NestJS, a progressive Node.js framework that uses TypeScript by default and is heavily inspired by Angular's architecture.

## Architecture

### Modules

The backend follows a modular architecture:

- **AppModule**: Main application module that imports all other modules
- **DatabaseModule**: Global module that provides database connection
- **AuthModule**: Handles authentication and authorization
- **UsersModule**: Manages user-related operations

### Database

We use Drizzle ORM with PostgreSQL for type-safe database operations.

#### Schema

```typescript
// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### GraphQL

The API uses GraphQL with Apollo Server. All GraphQL types are auto-generated from TypeScript classes using decorators.

#### Resolvers

- **AuthResolver**: Authentication mutations (login, register)
- **UsersResolver**: User queries and mutations (CRUD operations)

### Authentication

JWT-based authentication with Passport.js strategies:

- **LocalStrategy**: For email/password authentication
- **JwtStrategy**: For protecting routes with JWT tokens

### Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Validation**: Input validation with class-validator
- **Rate Limiting**: Throttling with @nestjs/throttler

## API Endpoints

### GraphQL Endpoint

- **URL**: `http://localhost:4000/graphql`
- **Playground**: Available in development mode

### Mutations

#### Authentication

```graphql
# Register a new user
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

# Login user
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

#### Users

```graphql
# Create user (same as register)
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    email
    username
    firstName
    lastName
  }
}

# Update user (protected)
mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $id, updateUserInput: $updateUserInput) {
    id
    email
    username
    firstName
    lastName
  }
}

# Delete user (protected)
mutation RemoveUser($id: ID!) {
  removeUser(id: $id) {
    id
  }
}
```

### Queries

```graphql
# Get all users (protected)
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

# Get single user (protected)
query GetUser($id: ID!) {
  user(id: $id) {
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

## Database Operations

### Migrations

```bash
# Generate migration
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

### Configuration

Database configuration is in `drizzle.config.ts`:

```typescript
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/maglo',
  },
});
```

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/maglo
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Development

### Running in Development

```bash
npm run dev:backend
```

### Debugging

The application includes detailed error logging and GraphQL error formatting for development.

### Hot Reload

NestJS supports hot reload in development mode with the `--watch` flag.

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

## Deployment

### Docker

```bash
# Development
docker build -t maglo-backend -f apps/backend/Dockerfile .

# Production
docker build -t maglo-backend --target runner -f apps/backend/Dockerfile .
```

### Environment Configuration

For production, ensure all environment variables are properly set and use strong JWT secrets.

## Error Handling

The application includes comprehensive error handling:

- **GraphQL errors**: Formatted for client consumption
- **Database errors**: Handled by Drizzle ORM
- **Validation errors**: Class-validator integration
- **Authentication errors**: Passport.js error handling