import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { CartItem, CartItemRow } from '../common/interfaces';

@Injectable()
export class CartRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findCartIdByUserId(userId: number): Promise<number | null> {
    const result = await this.pool.query<{ id: number }>(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId],
    );
    return result.rows[0]?.id ?? null;
  }

  async createCart(userId: number): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO carts (user_id, updated_at) VALUES ($1, NOW()) RETURNING id`,
      [userId],
    );
    return result.rows[0].id;
  }

  async findItemsByCartId(cartId: number): Promise<CartItem[]> {
    const result = await this.pool.query<CartItem>(
      `SELECT
         ci.id,
         ci.volume_id,
         ci.quantity,
         v.number   AS volume_number,
         v.price,
         v.cover_url,
         m.id       AS manga_id,
         m.title    AS manga_title
       FROM cart_items ci
       JOIN volumes v ON v.id = ci.volume_id
       JOIN manga m   ON m.id = v.manga_id
       WHERE ci.cart_id = $1
       ORDER BY ci.id`,
      [cartId],
    );
    return result.rows;
  }

  async findItemById(itemId: number): Promise<CartItemRow | null> {
    const result = await this.pool.query<CartItemRow>(
      `SELECT id, cart_id, volume_id, quantity FROM cart_items WHERE id = $1`,
      [itemId],
    );
    return result.rows[0] ?? null;
  }

  async upsertItem(
    cartId: number,
    volumeId: number,
    quantity: number,
  ): Promise<CartItemRow> {
    const result = await this.pool.query<CartItemRow>(
      `INSERT INTO cart_items (cart_id, volume_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, volume_id)
       DO UPDATE SET quantity = EXCLUDED.quantity
       RETURNING id, cart_id, volume_id, quantity`,
      [cartId, volumeId, quantity],
    );
    await this.pool.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [
      cartId,
    ]);
    return result.rows[0];
  }

  async updateItemQuantity(
    itemId: number,
    quantity: number,
    cartId: number,
  ): Promise<CartItemRow | null> {
    const result = await this.pool.query<CartItemRow>(
      `UPDATE cart_items SET quantity = $1 WHERE id = $2
       RETURNING id, cart_id, volume_id, quantity`,
      [quantity, itemId],
    );
    await this.pool.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [
      cartId,
    ]);
    return result.rows[0] ?? null;
  }

  async deleteItem(itemId: number, cartId: number): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM cart_items WHERE id = $1`,
      [itemId],
    );
    await this.pool.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [
      cartId,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}
