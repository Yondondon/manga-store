import { Pool } from 'pg';

export async function seedGenres(pool: Pool): Promise<Record<string, number>> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE TABLE genres RESTART IDENTITY CASCADE`);

    const genres = [
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Fantasy' },
      { name: 'Supernatural' },
      { name: 'Romance' },
      { name: 'Comedy' },
    ];

    const genreIds: Record<string, number> = {};

    for (const genre of genres) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO genres (name) VALUES ($1) RETURNING id`,
        [genre.name],
      );
      genreIds[genre.name] = result.rows[0].id;
    }

    await client.query('COMMIT');
    console.log('Genres seeded');
    return genreIds;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
