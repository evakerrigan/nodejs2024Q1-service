import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { pool } from './config';

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Начинаем транзакцию
    await client.query('BEGIN');

    // Создаем таблицу миграций, если её нет
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Получаем список выполненных миграций
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations',
    );
    const executedMigrationNames = new Set(
      executedMigrations.map((m) => m.name),
    );

    // Получаем список файлов миграций
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    // Выполняем новые миграции
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`Executing migration: ${file}`);

        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        await client.query(migrationSQL);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);

        console.log(`Migration ${file} completed successfully`);
      }
    }

    // Завершаем транзакцию
    await client.query('COMMIT');
    console.log('All migrations completed successfully');
  } catch (error) {
    // В случае ошибки откатываем транзакцию
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Запускаем миграции
runMigrations().catch(console.error);
