import { Pool } from 'pg';

export async function seedAuthors(pool: Pool): Promise<Record<string, number>> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE TABLE authors RESTART IDENTITY CASCADE`);

    const authors = [
      { name: 'Masashi Kishimoto' },
      { name: 'Eiichiro Oda' },
      { name: 'Tite Kubo' },
      { name: 'Gege Akutami' },
      { name: 'CLAMP' },
    ];

    const authorIds: Record<string, number> = {};

    for (const author of authors) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO authors (name) VALUES ($1) RETURNING id`,
        [author.name],
      );
      authorIds[author.name] = result.rows[0].id;
    }

    await client.query('COMMIT');
    console.log('Authors seeded');
    return authorIds;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
