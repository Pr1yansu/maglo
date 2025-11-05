import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { User } from '../../database/schema';

type FacebookProfile = Profile & {
  _json?: Record<string, unknown>;
};

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    const clientID = process.env.FACEBOOK_CLIENT_ID ?? 'placeholder';
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET ?? 'placeholder';
    const callbackURL =
      process.env.FACEBOOK_CALLBACK_URL ??
      'http://localhost:3000/auth/facebook/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'displayName', 'emails', 'photos', 'name'],
      enableProof: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    if (!profile?.id) {
      throw new UnauthorizedException('Facebook profile is missing an id');
    }

    const facebookProfile = profile as FacebookProfile;
    const email = profile.emails?.[0]?.value ?? null;
    const fullName =
      profile.displayName ??
      [profile.name?.givenName, profile.name?.familyName]
        .filter(Boolean)
        .join(' ') ??
      null;
    const avatarUrl = profile.photos?.[0]?.value ?? null;

    return this.authService.validateOAuthUser('facebook', {
      providerId: profile.id,
      email,
      fullName,
      avatarUrl,
      emailVerified: Boolean(email),
      metadata: facebookProfile._json,
    });
  }
}
