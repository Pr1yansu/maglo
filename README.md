# Maglo

A modern full-stack web application built with **NestJS**, **React**, **TypeScript**, **GraphQL**, and **Drizzle ORM**.

## 🚀 Features

- **Backend**: NestJS with GraphQL API
- **Frontend**: React 18 with Vite
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with ShadCN UI components
- **Animations**: GSAP for smooth animations
- **TypeScript**: Full type safety across the stack
- **SEO**: Built-in SEO optimization with React Helmet

## 📁 Project Structure

```
maglo/
├── backend/          # NestJS GraphQL API
│   ├── src/
│   │   ├── database/ # Drizzle configuration
│   │   ├── users/    # User module (GraphQL resolvers)
│   │   └── ...
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Utilities and animations
│   │   └── ...
│   └── package.json
└── package.json      # Root workspace configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository>
   cd maglo
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend  
   cp frontend/.env.example frontend/.env
   ```

3. **Configure database**:
   - Update `DATABASE_URL` in `backend/.env`
   - Run migrations: `npm run db:push`

4. **Start development servers**:
   ```bash
   npm run dev
   ```

This will start:
- Backend API at `http://localhost:3000`
- Frontend at `http://localhost:5173`
- GraphQL playground at `http://localhost:3000/graphql`

## 🎯 Available Scripts

### Root Commands
- `npm run dev` - Start both backend and frontend
- `npm run build` - Build both applications
- `npm run lint` - Lint both projects
- `npm run test` - Run all tests

### Database Commands
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### Individual Project Commands
- `npm run dev:backend` - Backend only
- `npm run dev:frontend` - Frontend only
- `npm run build:backend` - Build backend
- `npm run build:frontend` - Build frontend

## 🔧 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language and runtime
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **ShadCN UI** - Component library
- **GSAP** - Animation library
- **Apollo Client** - GraphQL client
- **React Router** - Client-side routing
- **React Helmet** - SEO management

## 📝 API Documentation

The GraphQL API is available at `/graphql` with the following main queries and mutations:

### Queries
- `users` - Get all users
- `user(id: Int!)` - Get user by ID

### Mutations
- `createUser(createUserInput: CreateUserInput!)` - Create new user
- `removeUser(id: Int!)` - Delete user

## 🎨 UI Components

The frontend uses ShadCN UI components with custom theming:
- Button, Input, Dialog components
- Dark/light mode support
- Responsive design patterns
- GSAP animations integration

## 🚀 Deployment

### Backend
1. Build: `npm run build:backend`
2. Set production environment variables
3. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend
1. Build: `npm run build:frontend`  
2. Deploy the `frontend/dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.