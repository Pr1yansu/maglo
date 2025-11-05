import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import { DatabaseType } from '../database/connection';
import { NewUser, User, users } from '../database/schema';

interface CreateUserOptions {
  email: string;
  fullName: string;
  password?: string | null;
  provider?: NewUser['provider'];
  providerId?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  metadata?: NewUser['metadata'];
}

interface UpsertOAuthUserOptions {
  provider: Exclude<NonNullable<NewUser['provider']>, 'local'>;
  providerId: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  metadata?: NewUser['metadata'];
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DatabaseType,
  ) {}

  async findById(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }

    const records = await this.db.query.users.findMany();
    return records.find((record) => record.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    const normalizedEmail = email.toLowerCase();
    const records = await this.db.query.users.findMany();
    return records.find((record) => record.email === normalizedEmail) ?? null;
  }

  async findByProvider(
    provider: NonNullable<NewUser['provider']>,
    providerId: string,
  ): Promise<User | null> {
    if (!providerId) {
      return null;
    }

    const records = await this.db.query.users.findMany();
    return (
      records.find(
        (record) =>
          record.provider === provider && record.providerId === providerId,
      ) ?? null
    );
  }

  async createUser(options: CreateUserOptions): Promise<User> {
    const now = new Date();
    const [user] = await this.db
      .insert(users)
      .values({
        email: options.email.toLowerCase(),
        fullName: options.fullName,
        password: options.password ?? null,
        provider: options.provider ?? 'local',
        providerId: options.providerId ?? null,
        avatarUrl: options.avatarUrl ?? null,
        emailVerified: options.emailVerified ?? false,
        metadata: options.metadata,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return user;
  }

  async upsertOAuthUser(options: UpsertOAuthUserOptions): Promise<User> {
    const now = new Date();
    const provider = options.provider;
    const providerId = options.providerId;

    const baseMetadata =
      options.metadata ?? ({ oauthProvider: provider } as NewUser['metadata']);

    const providerUser = await this.findByProvider(provider, providerId);
    if (providerUser) {
      const [updated] = await this.db
        .update(users)
        .set({
          fullName: options.fullName?.trim().length
            ? options.fullName.trim()
            : providerUser.fullName,
          avatarUrl: options.avatarUrl ?? providerUser.avatarUrl,
          email:
            options.email?.toLowerCase() ?? providerUser.email.toLowerCase(),
          emailVerified:
            options.emailVerified ?? providerUser.emailVerified ?? false,
          metadata: baseMetadata ?? providerUser.metadata,
          updatedAt: now,
        })
        // @ts-ignore - Drizzle type inference mismatch within the monorepo build pipeline
        .where(eq(users.id, providerUser.id))
        .returning();

      return updated ?? providerUser;
    }

    if (options.email) {
      const emailUser = await this.findByEmail(options.email);
      if (emailUser) {
        const [updated] = await this.db
          .update(users)
          .set({
            provider,
            providerId,
            fullName: options.fullName?.trim().length
              ? options.fullName.trim()
              : emailUser.fullName,
            avatarUrl: options.avatarUrl ?? emailUser.avatarUrl,
            email: options.email.toLowerCase(),
            emailVerified:
              options.emailVerified ?? emailUser.emailVerified ?? false,
            metadata: baseMetadata ?? emailUser.metadata,
            updatedAt: now,
          })
          // @ts-ignore - Drizzle type inference mismatch within the monorepo build pipeline
          .where(eq(users.id, emailUser.id))
          .returning();

        return updated ?? emailUser;
      }
    }

    const fallbackEmail = (
      options.email?.toLowerCase() ?? `${providerId}@${provider}.oauth.maglo`
    ).trim();

    const computedFullName = (() => {
      const raw = options.fullName ?? options.email ?? provider;
      const safe = raw?.trim();
      return safe && safe.length > 0 ? safe : `${provider} user`;
    })();

    const [created] = await this.db
      .insert(users)
      .values({
        email: fallbackEmail,
        fullName: computedFullName,
        password: null,
        provider,
        providerId,
        avatarUrl: options.avatarUrl ?? null,
        emailVerified: options.emailVerified ?? Boolean(options.email),
        metadata: baseMetadata,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return created;
  }

  async updateLastLogin(userId: string): Promise<void> {
    if (!userId) {
      return;
    }

    await this.db
      .update(users)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      // @ts-ignore - Drizzle types conflict under the monorepo toolchain.
      .where(eq(users.id, userId));
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
  ): Promise<User | null> {
    if (!userId) {
      return null;
    }

    const [user] = await this.db
      .update(users)
      .set({
        password: hashedPassword,
        changedPasswordAt: new Date(),
        updatedAt: new Date(),
      })
      // @ts-ignore - Drizzle types conflict under the monorepo toolchain.
      .where(eq(users.id, userId))
      .returning();

    return user ?? null;
  }
}
