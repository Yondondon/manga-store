import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import {
  CartItemWithStock,
  OrderDetail,
  OrderItemDetail,
  OrderRow,
} from '../common/interfaces';

@Injectable()
export class OrdersRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async getCartItems(userId: number): Promise<CartItemWithStock[]> {
    const result = await this.pool.query<CartItemWithStock>(
      `SELECT
         ci.id,
         ci.volume_id,
         ci.quantity,
         v.number        AS volume_number,
         v.price,
         v.quantity      AS quantity_in_stock,
         v.cover_url,
         m.id            AS manga_id,
         m.title         AS manga_title
       FROM carts c
       JOIN cart_items ci ON ci.cart_id = c.id
       JOIN volumes v     ON v.id = ci.volume_id
       JOIN manga m       ON m.id = v.manga_id
       WHERE c.user_id = $1
       ORDER BY ci.id`,
      [userId],
    );
    return result.rows;
  }

  async createOrderWithItems(
    client: PoolClient,
    userId: number,
    shippingAddress: string,
    totalPrice: number,
    items: CartItemWithStock[],
  ): Promise<number> {
    const orderResult = await client.query<{ id: number }>(
      `INSERT INTO orders (user_id, status, total_price, shipping_address, created_at)
       VALUES ($1, 'pending', $2, $3, NOW())
       RETURNING id`,
      [userId, totalPrice, shippingAddress],
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, volume_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.volume_id, item.quantity, item.price],
      );
    }

    return orderId;
  }

  async decrementStock(
    client: PoolClient,
    items: CartItemWithStock[],
  ): Promise<void> {
    for (const item of items) {
      await client.query(
        `UPDATE volumes SET quantity = quantity - $1 WHERE id = $2`,
        [item.quantity, item.volume_id],
      );
    }
  }

  async clearCart(client: PoolClient, userId: number): Promise<void> {
    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)`,
      [userId],
    );
  }

  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async findOrdersByUserId(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ rows: OrderRow[]; total: number }> {
    const [dataResult, countResult] = await Promise.all([
      this.pool.query<OrderRow>(
        `SELECT id, status, total_price, created_at
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset],
      ),
      this.pool.query<{ count: string }>(
        `SELECT COUNT(*)::int AS count FROM orders WHERE user_id = $1`,
        [userId],
      ),
    ]);

    return {
      rows: dataResult.rows,
      total: Number(countResult.rows[0].count),
    };
  }

  async findOrderByIdAndUserId(
    orderId: number,
    userId: number,
  ): Promise<OrderDetail | null> {
    const orderResult = await this.pool.query<OrderRow>(
      `SELECT id, status, total_price, shipping_address, created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId],
    );

    if (!orderResult.rows[0]) return null;

    const order = orderResult.rows[0];

    const itemsResult = await this.pool.query<OrderItemDetail>(
      `SELECT
         oi.id,
         oi.volume_id,
         oi.quantity,
         oi.price_at_purchase,
         v.number    AS volume_number,
         v.cover_url,
         m.id        AS manga_id,
         m.title     AS manga_title
       FROM order_items oi
       JOIN volumes v ON v.id = oi.volume_id
       JOIN manga m   ON m.id = v.manga_id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [orderId],
    );

    return {
      ...order,
      items: itemsResult.rows,
    };
  }
}
