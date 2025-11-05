import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService, PublicUser } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthPayloadModel } from './models/auth-payload.model';
import { PublicUserModel, AuthProviderModel } from './models/public-user.model';
import { CurrentUser } from './current-user.decorator';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from '../database/schema';

const providerMap: Record<string, AuthProviderModel> = {
  local: AuthProviderModel.LOCAL,
  google: AuthProviderModel.GOOGLE,
  facebook: AuthProviderModel.FACEBOOK,
};

function toGraphQLUser(user: PublicUser): PublicUserModel {
  const provider = user.provider?.toLowerCase() ?? 'local';
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    provider: providerMap[provider] ?? AuthProviderModel.LOCAL,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayloadModel)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayloadModel> {
    const result = await this.authService.register(input);
    return {
      accessToken: result.accessToken,
      user: toGraphQLUser(result.user),
    };
  }

  @Mutation(() => AuthPayloadModel)
  async login(@Args('input') input: LoginInput): Promise<AuthPayloadModel> {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    const result = await this.authService.login(user);
    return {
      accessToken: result.accessToken,
      user: toGraphQLUser(result.user),
    };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PublicUserModel)
  async me(@CurrentUser() user: User | null): Promise<PublicUserModel> {
    if (!user) {
      throw new UnauthorizedException('User not found in context');
    }

    return toGraphQLUser(this.authService.toPublicUser(user));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AuthPayloadModel)
  async refreshToken(
    @CurrentUser() user: User | null,
  ): Promise<AuthPayloadModel> {
    if (!user) {
      throw new UnauthorizedException('User not found in context');
    }

    const result = await this.authService.refresh(user.id);
    if (!result) {
      throw new UnauthorizedException('Unable to refresh token');
    }

    return {
      accessToken: result.accessToken,
      user: toGraphQLUser(result.user),
    };
  }
}
