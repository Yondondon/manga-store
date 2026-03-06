import 'dotenv/config';
import { pool } from '../db.config';
import { seedAuthors } from './authors.seed';
import { seedManga } from './manga.seed';

async function main() {
  try {
    const authorIds = await seedAuthors(pool);
    await seedManga(pool, authorIds);
    console.log('All seeds completed');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

void main();
