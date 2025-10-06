import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput, RegisterInput } from './dto/auth.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await this.usersService.validatePassword(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerInput.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const existingUsername = await this.usersService.findByUsername(registerInput.username);
    if (existingUsername) {
      throw new UnauthorizedException('Username already taken');
    }

    // Create new user
    const user = await this.usersService.create(registerInput);
    const { passwordHash, ...userWithoutPassword } = user;

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
