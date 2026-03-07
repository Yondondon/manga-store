import { Pool } from 'pg';

export async function createMangaTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "manga"
      (
        "id"          SERIAL       NOT NULL UNIQUE,
        "title"       VARCHAR(255) NOT NULL,
        "description" TEXT         NOT NULL,
        "author_id"   INTEGER      NOT NULL,
        "cover_url"   TEXT         NOT NULL,
        "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Manga table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
