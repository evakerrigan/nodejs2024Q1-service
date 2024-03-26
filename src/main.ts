import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { dirname, join } from 'node:path';
import { AppModule } from './app.module';

const PORT = Number(process.env.PORT) || 4000;
async function bootstrap() {
  const [app, api] = await Promise.all([
    NestFactory.create(AppModule),
    readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8'),
  ]);
  const document = load(api) as OpenAPIObject;
  SwaggerModule.setup('doc', app, document);
  await app.listen(PORT);
}

bootstrap();
