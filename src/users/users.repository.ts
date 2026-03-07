import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { UserPublic, UserRow } from '../common/interfaces';

@Injectable()
export class UsersRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findById(id: number): Promise<UserPublic | null> {
    const result = await this.pool.query<UserPublic>(
      `SELECT id, email, name, created_at FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await this.pool.query<UserRow>(
      `SELECT id, email, password, name, created_at FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0] ?? null;
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
  ): Promise<UserPublic> {
    const result = await this.pool.query<UserPublic>(
      `INSERT INTO users (email, password, name) VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name],
    );
    return result.rows[0];
  }

  async updateName(id: number, name: string): Promise<UserPublic | null> {
    const result = await this.pool.query<UserPublic>(
      `UPDATE users SET name = $1 WHERE id = $2
       RETURNING id, email, name, created_at`,
      [name, id],
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query(`DELETE FROM users WHERE id = $1`, [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}
