import { eq } from 'drizzle-orm';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUser, User, users } from 'src/database/schemas/user.schema';
import { type DrizzleDB } from 'src/database/types/drizzle';
import { DRIZZLE } from '../database/database.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async findAll(): Promise<User[]> {
    return this.db.query.users.findMany();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findByVerificationToken(token: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.refreshTokenHash, token),
    });
  }

  async create(data: CreateUser) {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  async update(id: string, data: Partial<CreateUser>) {
    const [user] = await this.db
      .update(users)
      .set({ ...data })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: string) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
