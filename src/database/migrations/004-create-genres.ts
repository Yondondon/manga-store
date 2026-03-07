import { Pool } from 'pg';

export async function createGenresTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "genres"
      (
        "id"   SERIAL       NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Genres table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
