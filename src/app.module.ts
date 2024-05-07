import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
