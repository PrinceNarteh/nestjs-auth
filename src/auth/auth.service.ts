import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';

export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async login() {}

  async register() {}
}
