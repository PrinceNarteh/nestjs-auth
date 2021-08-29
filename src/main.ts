import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie-Session
  app.use(
    cookieSession({
      keys: ['secret'],
    }),
  );

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // listening to PORT
  await app.listen(4000);
}
bootstrap();
