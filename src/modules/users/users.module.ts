import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './api-keys/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey])],
})
export class UsersModule {}
