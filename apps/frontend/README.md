# Frontend Documentation

## Overview

The frontend is a React application built with modern tools and best practices, featuring React Query for server state management, Tailwind CSS for styling, and Apollo Client for GraphQL integration with cookie-based authentication.

## Architecture

### Technology Stack

- **React 18**: Latest version with concurrent features
- **React Query**: Powerful server state management
- **Tailwind CSS**: Utility-first CSS framework
- **Apollo Client**: GraphQL client with caching
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Cookie-based Auth**: Secure authentication using httpOnly cookies

### Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components for routing
├── contexts/          # React context providers
├── hooks/             # Custom React hooks for auth and data
├── graphql/           # GraphQL client and operations
├── utils/             # Utility functions
├── App.tsx            # Main app component
└── main.tsx           # Application entry point
```

## State Management

### React Query + Context

The application uses React Query for server state and React Context for authentication:

- **AuthContext**: Authentication state and methods
- **React Query**: Server state caching and synchronization

#### Auth Context

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
}
```

Actions:
- `loginStart`: Set loading state
- `loginSuccess`: Store user and token
- `loginFailure`: Clear auth state
- `logout`: Clear all auth data

## GraphQL Integration

### Apollo Client Setup

```typescript
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
});
```

### Operations

#### Mutations

```typescript
// Login mutation
const LOGIN_MUTATION = gql`
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
`;

// Register mutation
const REGISTER_MUTATION = gql`
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
`;
```

#### Queries

```typescript
// Get users query
const GET_USERS_QUERY = gql`
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
`;
```

## Routing

### Route Configuration

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
</Routes>
```

### Protected Routes

Protected routes should check authentication state:

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

## Styling

### Tailwind CSS

The application uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

### Component Styling

Example component with Tailwind classes:

```tsx
const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Components

### Layout Component

Provides consistent navigation and layout:

```tsx
export const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        {/* Navigation content */}
      </nav>
      <main className=" mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};
```

### Page Components

#### Login Page

```tsx
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data } = await login({
        variables: { loginInput: { email, password } }
      });

      if (data?.login) {
        dispatch(loginSuccess({
          user: data.login.user,
          token: data.login.access_token
        }));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  // JSX render
};
```

## Development

### Environment Variables

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### Development Server

```bash
npm run dev:frontend
```

The development server runs on `http://localhost:3000` with hot reload.

### Build Process

```bash
npm run build
```

Builds the application for production using Vite.

## Authentication Flow

1. User enters credentials on login page
2. Apollo Client sends GraphQL mutation to backend
3. Backend validates credentials and sets httpOnly cookie with JWT token
4. Frontend reads authentication state from Apollo Client context
5. Apollo Client automatically includes cookies for requests
6. Protected routes check authentication state from AuthContext

## Error Handling

### Apollo Client Errors

```typescript
const { mutate: login, isLoading, error } = useLogin();

if (error) {
  // Handle GraphQL errors
  console.error('Login error:', error.message);
}
```

### Form Validation

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!email) newErrors.email = 'Email is required';
  if (!password) newErrors.password = 'Password is required';
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Performance Optimizations

### Code Splitting

```typescript
const LazyDashboard = lazy(() => import('./pages/DashboardPage'));

// In routes
<Route 
  path="/dashboard" 
  element={
    <Suspense fallback={<div>Loading...</div>}>
      <LazyDashboard />
    </Suspense>
  } 
/>
```

### React Query Caching

React Query automatically caches server responses. You can customize caching behavior:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## Testing

### Unit Tests

```bash
npm run test
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## Deployment

### Build for Production

```bash
npm run build
```

### Vercel Deployment

The frontend is configured for Vercel deployment with `vercel.json`:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`

Set environment variables in Vercel dashboard:
```env
VITE_GRAPHQL_URL=https://your-backend-domain.onrender.com/graphql
```

### Alternative: Render Deployment

For Render deployment, use the Dockerfile provided:

```bash
docker build -t maglo-frontend -f apps/frontend/Dockerfile .
```

### Environment Configuration

Ensure production environment variables are set:

```env
VITE_GRAPHQL_URL=https://your-api-domain.com/graphql
```

## Best Practices

1. **State Management**: Use React Query for server state, Context for authentication
2. **Component Design**: Keep components small and focused on single responsibility
3. **Type Safety**: Use TypeScript interfaces for props and state
4. **Security**: Use httpOnly cookies for authentication tokens
4. **Error Boundaries**: Implement error boundaries for graceful error handling
5. **Performance**: Use React.memo for expensive components, useMemo for expensive calculations
6. **Accessibility**: Include proper ARIA labels and semantic HTML