/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe());
  const globalPrefix = process.env.BACKEND_API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors() //TODO implement this properly (ie set the allow origin and headers etc )
  const port = process.env.BACKEND_PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
