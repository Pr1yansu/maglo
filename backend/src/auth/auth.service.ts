import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../database/schema';

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
