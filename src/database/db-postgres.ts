import { Pool, QueryResult } from 'pg';
import { pool } from './config';

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  // Базовый метод для выполнения запросов
  async query<T>(text: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Метод для начала транзакции
  async beginTransaction() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      return client;
    } catch (error) {
      await client.release();
      throw error;
    }
  }

  // Метод для подтверждения транзакции
  async commitTransaction(client: any) {
    try {
      await client.query('COMMIT');
    } finally {
      client.release();
    }
  }

  // Метод для отката транзакции
  async rollbackTransaction(client: any) {
    try {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }

  // Базовые CRUD операции
  async findOne<T>(table: string, id: string): Promise<T | null> {
    const result = await this.query<T>(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll<T>(table: string): Promise<T[]> {
    const result = await this.query<T>(`SELECT * FROM ${table}`);
    return result.rows;
  }

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const result = await this.query<T>(
      `INSERT INTO ${table} (${columns.join(', ')}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(', ');
    
    const result = await this.query<T>(
      `UPDATE ${table} 
       SET ${setClause} 
       WHERE id = $${values.length + 1} 
       RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }

  async delete(table: string, id: string): Promise<void> {
    await this.query(
      `DELETE FROM ${table} WHERE id = $1`,
      [id]
    );
  }
}

export const db = new Database();