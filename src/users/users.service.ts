import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module';
import { CreateUser, users } from 'src/database/schemas/user.schema';
import { type DrizzleDB } from 'src/database/types/drizzle';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  getUser() {
    return this.db.query.users.findMany();
  }

  createUser(user: CreateUser) {
    return this.db.insert(users).values(user);
  }
}
