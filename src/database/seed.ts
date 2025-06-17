import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { pool } from './config';

async function runSeeds() {
  const client = await pool.connect();

  try {
    // Начинаем транзакцию
    await client.query('BEGIN');

    // Получаем список файлов с seed-данными
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    // Выполняем seed-файлы
    for (const file of seedFiles) {
      console.log(`Executing seed: ${file}`);

      const seedPath = path.join(seedsDir, file);
      const seedSQL = fs.readFileSync(seedPath, 'utf8');

      await client.query(seedSQL);
      console.log(`Seed ${file} completed successfully`);
    }

    // Завершаем транзакцию
    await client.query('COMMIT');
    console.log('All seeds completed successfully');
  } catch (error) {
    // В случае ошибки откатываем транзакцию
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Запускаем seed-данные
runSeeds().catch(console.error);
