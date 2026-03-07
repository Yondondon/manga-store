import 'dotenv/config';
import { pool } from '../db.config';
import { seedAuthors } from './authors.seed';
import { seedManga } from './manga.seed';
import { seedGenres } from './genres.seed';
import { seedVolumes } from './volumes.seed';
import { seedMangaGenres } from './manga-genres.seed';

async function main() {
  try {
    const authorIds = await seedAuthors(pool);
    const mangaIds = await seedManga(pool, authorIds);
    await seedVolumes(pool, mangaIds);
    const genreIds = await seedGenres(pool);
    await seedMangaGenres(pool, mangaIds, genreIds);
    console.log('All seeds completed');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

void main();
