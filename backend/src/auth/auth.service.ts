import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, type NewUser } from '../database/schema';

const DEFAULT_SALT_ROUNDS = 12;

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  provider: User['provider'];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  accessToken: string;
  user: PublicUser;
}

export interface OAuthProfile {
  providerId: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  metadata?: NewUser['metadata'];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? null,
      provider: user.provider,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async signToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      provider: user.provider,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<AuthResult> {
    const accessToken = await this.signToken(user);
    await this.usersService.updateLastLogin(user.id);
    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  async validateOAuthUser(
    provider: Exclude<User['provider'], 'local'>,
    profile: OAuthProfile,
  ): Promise<User> {
    if (!profile.providerId) {
      throw new UnauthorizedException('Missing provider identifier');
    }

    const user = await this.usersService.upsertOAuthUser({
      provider,
      providerId: profile.providerId,
      email: profile.email ?? null,
      fullName: profile.fullName ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      emailVerified: profile.emailVerified,
      metadata: profile.metadata,
    });

    if (!user) {
      throw new UnauthorizedException('Unable to resolve OAuth user');
    }

    return user;
  }

  async loginWithOAuth(
    provider: Exclude<User['provider'], 'local'>,
    profile: OAuthProfile,
  ): Promise<AuthResult> {
    const user = await this.validateOAuthUser(provider, profile);
    return this.login(user);
  }

  async register(options: {
    email: string;
    fullName: string;
    password: string;
  }): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(options.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = Number.parseInt(
      process.env.BCRYPT_SALT_ROUNDS ?? '',
      10,
    );
    const hashedPassword = await hash(
      options.password,
      Number.isNaN(saltRounds) ? DEFAULT_SALT_ROUNDS : saltRounds,
    );

    const user = await this.usersService.createUser({
      email: options.email,
      fullName: options.fullName,
      password: hashedPassword,
    });

    const accessToken = await this.signToken(user);
    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  async refresh(userId: string): Promise<AuthResult | null> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }

    const accessToken = await this.signToken(user);
    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }
}
