import { Pool } from 'pg';

export async function seedMangaGenres(
  pool: Pool,
  mangaIds: Record<string, number>,
  genresIds: Record<string, number>,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE TABLE manga_genres RESTART IDENTITY CASCADE`);

    const mangaGenres = [
      {
        mangaName: 'Naruto',
        genreName: 'Action',
      },
      {
        mangaName: 'Naruto',
        genreName: 'Adventure',
      },
      {
        mangaName: 'Naruto',
        genreName: 'Fantasy',
      },
      {
        mangaName: 'Bleach',
        genreName: 'Action',
      },
      {
        mangaName: 'Bleach',
        genreName: 'Adventure',
      },
      {
        mangaName: 'Bleach',
        genreName: 'Supernatural',
      },
      {
        mangaName: 'One Piece',
        genreName: 'Action',
      },
      {
        mangaName: 'One Piece',
        genreName: 'Adventure',
      },
      {
        mangaName: 'One Piece',
        genreName: 'Fantasy',
      },
      {
        mangaName: 'Jujutsu Kaisen',
        genreName: 'Action',
      },
      {
        mangaName: 'Jujutsu Kaisen',
        genreName: 'Supernatural',
      },
      {
        mangaName: 'Cardcaptor Sakura',
        genreName: 'Comedy',
      },
      {
        mangaName: 'Cardcaptor Sakura',
        genreName: 'Adventure',
      },
      {
        mangaName: 'Cardcaptor Sakura',
        genreName: 'Fantasy',
      },
      {
        mangaName: 'Cardcaptor Sakura',
        genreName: 'Romance',
      },
    ];

    for (const mangaGenre of mangaGenres) {
      await client.query(
        `INSERT INTO manga_genres (manga_id, genre_id) VALUES ($1, $2)`,
        [mangaIds[mangaGenre.mangaName], genresIds[mangaGenre.genreName]],
      );
    }

    await client.query('COMMIT');
    console.log('Manga-genres seeded');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
