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
        metadata: options.metadata,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return user;
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
