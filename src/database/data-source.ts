import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { DataSource } from 'typeorm';

dotenvExpand.expand(dotenv.config());

export default new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
