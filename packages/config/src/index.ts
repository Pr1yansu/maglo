// Base TypeScript configuration
export const tsConfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022'],
    module: 'commonjs',
    moduleResolution: 'node',
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    strict: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
  },
  exclude: ['node_modules', 'dist', '**/*.spec.ts', '**/*.test.ts'],
};

// ESLint configuration
export const eslintConfig = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', '@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  env: {
    node: true,
    jest: true,
  },
};

// Prettier configuration
export const prettierConfig = {
  semi: true,
  trailingComma: 'es5' as const,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
};

// Jest configuration for backend
export const jestConfigBackend = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

// Environment variables schema
export const envSchema = {
  // Database
  DATABASE_URL: {
    required: true,
    example: 'postgresql://user:password@localhost:5432/maglo',
  },

  // Server
  PORT: {
    required: false,
    default: '4000',
    example: '4000',
  },
  NODE_ENV: {
    required: false,
    default: 'development',
    example: 'development',
  },

  // Frontend
  FRONTEND_URL: {
    required: false,
    default: 'http://localhost:3000',
    example: 'http://localhost:3000',
  },

  // JWT
  JWT_SECRET: {
    required: true,
    example: 'your-super-secret-jwt-key',
  },
  JWT_EXPIRES_IN: {
    required: false,
    default: '7d',
    example: '7d',
  },
};
