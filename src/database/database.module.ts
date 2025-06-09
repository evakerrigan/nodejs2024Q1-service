import { Module } from '@nestjs/common';
import { Database } from './db-postgres';

@Module({
  providers: [Database],
  exports: [Database],
})
export class DatabaseModule {} 