import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { IamModule } from './modules/iam/iam.module';
import { UsersModule } from './modules/users/users.module';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule.forRoot({
      type: 'single',
      url: process.env.RD_URL,
    }),
    IamModule,
    UsersModule,
    CoffeesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
