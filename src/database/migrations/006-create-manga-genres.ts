import { Pool } from 'pg';

export async function createMangaGenresTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "manga_genres"
      (
        "manga_id" INTEGER NOT NULL,
        "genre_id" INTEGER NOT NULL,
        PRIMARY KEY ("manga_id", "genre_id")
      )
    `);

    await client.query('COMMIT');
    console.log('MangaGenres table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
