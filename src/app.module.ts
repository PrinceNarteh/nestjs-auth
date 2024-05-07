import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { IamModule } from './modules/iam/iam.module';

@Module({
  imports: [EnvModule, DatabaseModule, IamModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
