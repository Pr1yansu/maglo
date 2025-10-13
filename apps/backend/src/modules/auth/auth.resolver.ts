import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse, LoginInput, RegisterInput } from './dto/auth.input';
import { SocialAuthInput, PhoneSendInput, PhoneVerifyInput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: any
  ): Promise<AuthResponse> {
    const result = await this.authService.login(loginInput);

    // Set cookie with JWT token
    context.res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return result;
  }

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: any
  ): Promise<AuthResponse> {
    const result = await this.authService.register(registerInput);

    // Set cookie with JWT token
    context.res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return result;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    context.res.clearCookie('token');
    return true;
  }

  @Mutation(() => AuthResponse)
  async socialAuth(
    @Args('input') input: SocialAuthInput,
    @Context() context: any
  ): Promise<AuthResponse> {
    const result = await this.authService.socialAuth(input as any);
    context.res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return result as AuthResponse;
  }

  @Mutation(() => Boolean)
  async sendPhoneCode(@Args('input') input: PhoneSendInput) {
    await this.authService.sendPhoneCode(input);
    return true;
  }

  @Mutation(() => Boolean)
  async verifyPhoneCode(@Args('input') input: PhoneVerifyInput) {
    const ok = await this.authService.verifyPhoneCode(input);
    return ok;
  }
}
