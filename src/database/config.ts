import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'home_library',
  password: 'password',
  port: 5432,
});