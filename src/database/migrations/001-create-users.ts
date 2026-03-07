import { Pool } from 'pg';

export async function createUsersTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "users"
      (
        "id"         SERIAL       NOT NULL UNIQUE,
        "email"      VARCHAR(255) NOT NULL UNIQUE,
        "password"   VARCHAR(255) NOT NULL,
        "name"       VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Users table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
