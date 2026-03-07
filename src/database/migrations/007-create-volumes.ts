import { Pool } from 'pg';

export async function createVolumesTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "volumes"
      (
        "id"        SERIAL         NOT NULL UNIQUE,
        "manga_id"  INTEGER        NOT NULL,
        "number"    SMALLINT       NOT NULL,
        "price"     NUMERIC(10, 2) NOT NULL,
        "quantity"  INTEGER        NOT NULL DEFAULT 0,
        "cover_url" TEXT           NOT NULL,
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Volumes table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
