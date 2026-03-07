import { Pool } from 'pg';

export async function createCartsTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "carts"
      (
        "id"         SERIAL      NOT NULL UNIQUE,
        "user_id"    INTEGER     NOT NULL UNIQUE,
        "updated_at" TIMESTAMPTZ NOT NULL,
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Carts table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
