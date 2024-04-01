import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { dirname, join } from 'node:path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './logging/exception.filter';
import { LoggingService } from './logging/logging.service';

const PORT = Number(process.env.PORT) || 4000;
async function bootstrap() {
  const [app, api] = await Promise.all([
    NestFactory.create(AppModule, {
      bufferLogs: true,
    }),
    readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8'),
  ]);
  const document = load(api) as OpenAPIObject;
  SwaggerModule.setup('doc', app, document);

  const logger = app.get(LoggingService);
  app.useLogger(logger);

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    const errorMessage =
      reason instanceof Error ? reason.stack : reason.toString();

    logger.error('Unhandled Rejection:', errorMessage);
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  await app.listen(PORT);
}

bootstrap();
