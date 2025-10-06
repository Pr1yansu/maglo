import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as bcrypt from 'bcryptjs';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { users } from '../../database/schema';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: PostgresJsDatabase<any>
  ) {}

  async findAll() {
    return this.db.select().from(users);
  }

  async findById(id: string) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async findByEmail(email: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async findByUsername(username: string) {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  }

  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 12);

    const result = await this.db
      .insert(users)
      .values({
        email: createUserInput.email,
        username: createUserInput.username,
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        passwordHash: hashedPassword,
      })
      .returning();

    return result[0];
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const updateData: any = { ...updateUserInput };

    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 12);
      delete updateData.password;
    }

    updateData.updatedAt = new Date();

    const result = await this.db.update(users).set(updateData).where(eq(users.id, id)).returning();

    return result[0];
  }

  async remove(id: string) {
    const result = await this.db.delete(users).where(eq(users.id, id)).returning();

    return result[0];
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
