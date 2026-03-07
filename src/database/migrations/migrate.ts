import 'dotenv/config';
import { pool } from '../db.config';
import { createUsersTable } from './001-create-users';
import { Pool } from 'pg';
import { createOrdersTable } from './002-create-orders';
import { createAuthorsTable } from './003-create-authors';
import { createGenresTable } from './004-create-genres';
import { createMangaTable } from './005-create-manga';
import { createMangaGenresTable } from './006-create-manga-genres';
import { createVolumesTable } from './007-create-volumes';
import { createCartsTable } from './008-create-carts';
import { createCartItemsTable } from './009-create-cart-items';
import { createOrderItemsTable } from './010-create-order-items';
import { addRelations } from './011-add-relations';

async function ensureMigrationsTable(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function runMigration(
  pool: Pool,
  name: string,
  fn: (pool: Pool) => Promise<void>,
) {
  const { rows } = await pool.query(
    `SELECT id FROM _migrations WHERE name = $1`,
    [name],
  );

  if (rows.length > 0) {
    console.log(`Skipping ${name} (already applied)`);
    return;
  }

  await fn(pool);

  await pool.query(`INSERT INTO _migrations (name) VALUES ($1)`, [name]);
}

async function main() {
  await ensureMigrationsTable(pool);

  await runMigration(pool, '001-create-users', createUsersTable);
  await runMigration(pool, '002-create-orders', createOrdersTable);
  await runMigration(pool, '003-create-authors', createAuthorsTable);
  await runMigration(pool, '004-create-genres', createGenresTable);
  await runMigration(pool, '005-create-manga', createMangaTable);
  await runMigration(pool, '006-create-manga-genres', createMangaGenresTable);
  await runMigration(pool, '007-create-volumes', createVolumesTable);
  await runMigration(pool, '008-create-carts', createCartsTable);
  await runMigration(pool, '009-create-cart-items', createCartItemsTable);
  await runMigration(pool, '010-create-order-items', createOrderItemsTable);
  await runMigration(pool, '011-add-relations', addRelations);
}

void main();
