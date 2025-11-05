import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '../../database/schema';

function resolveGoogleEmail(profile: Profile): {
  email: string | null;
  verified: boolean;
} {
  const primary = profile.emails?.[0];
  if (!primary) {
    const raw =
      (profile._json as { email?: string; email_verified?: boolean }) ?? {};
    return {
      email: raw.email ?? null,
      verified: Boolean(raw.email_verified),
    };
  }

  const verified = Boolean((primary as { verified?: boolean }).verified);
  return {
    email: primary.value ?? null,
    verified,
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID ?? 'placeholder';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? 'placeholder';
    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3000/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    if (!profile?.id) {
      throw new UnauthorizedException('Google profile is missing an id');
    }

    const { email, verified } = resolveGoogleEmail(profile);
    const fullName =
      profile.displayName ??
      [profile.name?.givenName, profile.name?.familyName]
        .filter(Boolean)
        .join(' ') ??
      null;
    const avatarUrl = profile.photos?.[0]?.value ?? null;

    return this.authService.validateOAuthUser('google', {
      providerId: profile.id,
      email,
      fullName,
      avatarUrl,
      emailVerified: verified,
      metadata: (profile._json as Record<string, unknown>) ?? undefined,
    });
  }
}
