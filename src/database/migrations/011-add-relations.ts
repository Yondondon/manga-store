import { Pool } from 'pg';

export async function addRelations(pool: Pool) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE "manga"
        ADD FOREIGN KEY ("author_id") REFERENCES "authors" ("id")
            ON UPDATE NO ACTION ON DELETE RESTRICT;
    `);

    await client.query(`
      ALTER TABLE "volumes"
        ADD FOREIGN KEY ("manga_id") REFERENCES "manga" ("id")
          ON UPDATE NO ACTION ON DELETE CASCADE;
    `);

    await client.query(`
      ALTER TABLE "carts"
        ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")
          ON UPDATE NO ACTION ON DELETE CASCADE;
    `);

    await client.query(`
      ALTER TABLE "cart_items"
        ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id")
          ON UPDATE NO ACTION ON DELETE CASCADE;
    `);

    await client.query(`
      ALTER TABLE "orders"
        ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")
          ON UPDATE NO ACTION ON DELETE CASCADE;
    `);

    await client.query(`
      ALTER TABLE "order_items"
        ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id")
          ON UPDATE NO ACTION ON DELETE CASCADE;
    `);

    await client.query(`
      ALTER TABLE "order_items"
        ADD FOREIGN KEY ("volume_id") REFERENCES "volumes" ("id")
          ON UPDATE NO ACTION ON DELETE NO ACTION;
    `);

    await client.query(`
      ALTER TABLE "cart_items"
        ADD FOREIGN KEY ("volume_id") REFERENCES "volumes" ("id")
          ON UPDATE NO ACTION ON DELETE NO ACTION;
    `);

    await client.query(`
      ALTER TABLE "cart_items"
        ADD CONSTRAINT cart_items_cart_id_volume_id_unique UNIQUE ("cart_id", "volume_id")
    `);

    await client.query('COMMIT');
    console.log('Relations added');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
