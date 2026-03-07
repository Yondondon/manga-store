import { Pool } from 'pg';

export async function createOrdersTable(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "orders"
      (
        "id"               BIGSERIAL      NOT NULL UNIQUE,
        "user_id"          INTEGER        NOT NULL,
        "status"           VARCHAR(255)   NOT NULL,
        "total_price"      NUMERIC(10, 2) NOT NULL DEFAULT 0,
        "shipping_address" TEXT           NOT NULL,
        "created_at"       TIMESTAMPTZ    NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )
    `);

    await client.query('COMMIT');
    console.log('Orders table created');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
