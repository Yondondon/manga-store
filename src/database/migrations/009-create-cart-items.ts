import { Pool } from 'pg';

export async function createCartItemsTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "cart_items"
      (
        "id"        SERIAL  NOT NULL UNIQUE,
        "cart_id"   INTEGER NOT NULL,
        "volume_id" INTEGER NOT NULL,
        "quantity"  INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('CartItems table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
