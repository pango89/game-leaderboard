import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { options } from './configurations/logger';
import { HttpExceptionFilter } from './exception-filters/http-exception-filter';
import { expressMiddleware } from 'cls-rtracer';
import * as express from 'express';
import * as requestIp from 'request-ip';
import { morganMiddleware } from './configurations/http-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(options),
    cors: {
      origin:
        process.env.CORS_ORIGIN === '*'
          ? '*'
          : new RegExp(process.env.CORS_ORIGIN),
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  if (process.env.NODE_ENV && process.env.NODE_ENV === 'DEV') {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Origami Service')
      .setDescription('Nestjs Service APIs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('api', app, swaggerDocument);
  }

  app.use(expressMiddleware({ useHeader: true }));
  app.use(express.json());
  app.use(morganMiddleware);
  app.use(requestIp.mw());
  await app.listen(+process.env.SERVICE_PORT || 3001);
}

bootstrap();
