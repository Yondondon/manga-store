import { Pool } from 'pg';

export async function createOrderItemsTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "order_items"
      (
        "id"                SERIAL         NOT NULL UNIQUE,
        "order_id"          INTEGER        NOT NULL,
        "volume_id"         INTEGER        NOT NULL,
        "quantity"          INTEGER        NOT NULL DEFAULT 0,
        "price_at_purchase" NUMERIC(10, 2) NOT NULL DEFAULT 0,
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('OrderItems table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
