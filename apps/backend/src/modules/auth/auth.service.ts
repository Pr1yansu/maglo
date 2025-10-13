import { Injectable, UnauthorizedException, BadRequestException, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  LoginInput,
  RegisterInput,
  SocialAuthInput,
  PhoneSendInput,
  PhoneVerifyInput,
  SocialProvider,
} from './dto/auth.input';
import { TwilioService } from './twilio.service';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Optional() private readonly twilioService?: TwilioService
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

  async socialAuth(input: SocialAuthInput) {
    // Verify provider token and extract profile
    let profile: any = null;
    if (input.provider === SocialProvider.GOOGLE) {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${input.accessToken}`
      );
      if (!res.ok) throw new UnauthorizedException('Invalid Google token');
      profile = await res.json();
    } else if (input.provider === SocialProvider.GITHUB) {
      // GitHub: accessToken -> get user
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${input.accessToken}` },
      });
      if (!res.ok) throw new UnauthorizedException('Invalid GitHub token');
      profile = await res.json();
    } else if (input.provider === SocialProvider.FACEBOOK) {
      const res = await fetch(
        `https://graph.facebook.com/me?access_token=${input.accessToken}&fields=id,name,email`
      );
      if (!res.ok) throw new UnauthorizedException('Invalid Facebook token');
      profile = await res.json();
    } else {
      throw new BadRequestException('Unsupported provider');
    }

    // Map profile to user identity (email preferred)
    const email = profile.email || profile.email_address || profile._json?.email;
    let user = null;
    if (email) user = await this.usersService.findByEmail(email);

    if (!user) {
      // create a user with a generated username if missing
      const username = profile.login || profile.name?.replace(/\s+/g, '_') || `user_${profile.id}`;
      user = await this.usersService.create({
        email: email || `${profile.id}@${input.provider}.local`,
        username,
        password: Math.random().toString(36) + 'A1',
      });
    }

    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async sendPhoneCode(input: PhoneSendInput) {
    if (!this.twilioService) throw new BadRequestException('Twilio not configured');
    return this.twilioService.sendVerificationCode(input.phone);
  }

  async verifyPhoneCode(input: PhoneVerifyInput) {
    if (!this.twilioService) throw new BadRequestException('Twilio not configured');
    const ok = await this.twilioService.verifyCode(input.phone, input.code);
    if (!ok) throw new UnauthorizedException('Invalid code');
    // optionally, mark user's phone as verified or create user if none
    return ok;
  }
}
