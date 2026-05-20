import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/database/database.module';
import { Schema } from 'src/database/schemas';
import { CreateUser, users } from 'src/database/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<Schema>,
  ) {}

  getUser() {
    return this.db.query.users.findMany();
  }

  createUser(user: CreateUser) {
    return this.db.insert(users).values(user);
  }
}
