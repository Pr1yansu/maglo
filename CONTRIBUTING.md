# Contributing to Maglo

We welcome contributions to Maglo! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- PostgreSQL (or Docker)

### Setting up the Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/maglo.git
   cd maglo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. Start the development environment:
   ```bash
   npm run docker:dev
   # or setup PostgreSQL locally and run:
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

Examples:
- `feature/user-profile-page`
- `fix/login-validation-error`
- `docs/api-documentation`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests
- `chore` - Maintenance tasks

Examples:
- `feat(auth): add password reset functionality`
- `fix(api): resolve user creation validation error`
- `docs(readme): update installation instructions`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```
5. Update documentation if needed
6. Commit your changes with conventional commit messages
7. Push to your fork
8. Create a pull request

### Pull Request Guidelines

- Provide a clear title and description
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI passes
- Request review from maintainers

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Use proper typing (avoid `any`)
- Follow existing code patterns

### React Components

```tsx
// Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  onClick 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Backend Services

```typescript
// Good
@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: PostgresJsDatabase<any>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));
    
    return result[0] || null;
  }
}
```

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use semantic class names for custom CSS
- Maintain consistent spacing and typography

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- React components (using React Testing Library)
- Service methods
- GraphQL resolvers

### Integration Tests

Write integration tests for:
- API endpoints
- Database operations
- Authentication flows

### E2E Tests

Write E2E tests for:
- Critical user journeys
- Authentication flows
- Main application features

### Running Tests

```bash
# All tests
npm run test

# Backend tests only
npm run test --workspace=apps/backend

# Frontend tests only
npm run test --workspace=apps/frontend

# With coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Database Changes

### Schema Changes

1. Modify schema in `apps/backend/src/database/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Review generated migration
4. Test migration:
   ```bash
   npm run db:migrate
   ```
5. Update TypeScript types if needed

### Migration Guidelines

- Always test migrations on a copy of production data
- Ensure backward compatibility
- Include rollback instructions
- Document breaking changes

## Documentation

### Code Documentation

- Use JSDoc for functions and classes
- Include examples for complex APIs
- Document environment variables
- Update README files for significant changes

### API Documentation

- Update GraphQL schema descriptions
- Include examples in documentation
- Document authentication requirements
- Explain error responses

## Security

### Security Guidelines

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all inputs
- Implement proper authentication and authorization
- Follow OWASP guidelines

### Reporting Security Issues

Please report security vulnerabilities privately to the maintainers rather than creating public issues.

## Performance

### Performance Guidelines

- Optimize database queries
- Implement proper caching
- Use lazy loading for large components
- Optimize bundle size
- Monitor performance metrics

## Release Process

### Version Bumping

We follow semantic versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Migration guide (if needed)
- [ ] Security review completed

## Getting Help

### Where to Ask Questions

- GitHub Discussions for general questions
- GitHub Issues for bugs and feature requests
- Pull Request comments for code review questions

### Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [GraphQL Documentation](https://graphql.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

Thank you for contributing to Maglo! 🎉