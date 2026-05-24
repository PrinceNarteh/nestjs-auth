import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  // set global prefix
  app.setGlobalPrefix('api');

  // add pipes for validations and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    }),
  );

  // add exception handlers
  app.useGlobalFilters(new HttpExceptionFilter());

  // setup Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Auth API')
    .setDescription('Complete authentication system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);

  const BASE_URL = `http://localhost:${port}/api`;
  console.log(`Application running on ${BASE_URL}`);
  console.log(`Swagger docs at ${BASE_URL}/docs`);
}

bootstrap();
