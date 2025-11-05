import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { User } from '../database/schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
    // Passport redirect handling
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.handleOAuthCallback(req, res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth(): void {
    // Passport redirect handling
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.handleOAuthCallback(req, res);
  }

  private async handleOAuthCallback(
    req: Request,
    res: Response,
  ): Promise<void> {
    const user = req.user as User | undefined;

    if (!user) {
      this.logger.warn(
        'OAuth callback invoked without a user on request context',
      );
      res.redirect(this.buildRedirectUrl('failure', { error: 'missing_user' }));
      return;
    }

    try {
      const result = await this.authService.login(user);
      res.redirect(
        this.buildRedirectUrl('success', {
          token: result.accessToken,
          provider: result.user.provider ?? undefined,
        }),
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to complete OAuth callback: ${err.message}`,
        err.stack,
      );
      res.redirect(this.buildRedirectUrl('failure', { error: 'server_error' }));
    }
  }

  private buildRedirectUrl(
    type: 'success' | 'failure',
    params: Record<string, string | undefined>,
  ): string {
    const base =
      type === 'success'
        ? (process.env.OAUTH_SUCCESS_REDIRECT ??
          'http://localhost:5173/auth/callback')
        : (process.env.OAUTH_FAILURE_REDIRECT ?? 'http://localhost:5173/login');

    const target = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        target.searchParams.set(key, value);
      }
    });

    return target.toString();
  }
}
