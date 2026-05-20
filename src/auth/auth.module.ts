import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
