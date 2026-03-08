import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CartItemWithStock,
  OrderDetail,
  OrderRow,
  PaginatedResult,
} from '../common/interfaces';
import { CheckoutDto } from './dto/checkout.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async checkout(userId: number, dto: CheckoutDto): Promise<OrderDetail> {
    const items: CartItemWithStock[] =
      await this.ordersRepository.getCartItems(userId);

    if (items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    const insufficientStock = items.find(
      (item) => item.quantity_in_stock < item.quantity,
    );
    if (insufficientStock) {
      throw new ConflictException(
        `Insufficient stock for volume #${insufficientStock.volume_id}`,
      );
    }

    const totalPrice =
      items.reduce(
        (sum, item) =>
          sum + Math.round(Number(item.price) * 100) * item.quantity,
        0,
      ) / 100;

    const client = await this.ordersRepository.connect();
    try {
      await client.query('BEGIN');

      const orderId = await this.ordersRepository.createOrderWithItems(
        client,
        userId,
        dto.shippingAddress,
        totalPrice,
        items,
      );

      await this.ordersRepository.decrementStock(client, items);
      await this.ordersRepository.clearCart(client, userId);

      await client.query('COMMIT');

      const order = await this.ordersRepository.findOrderByIdAndUserId(
        orderId,
        userId,
      );
      return order!;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getOrders(
    userId: number,
    query: GetOrdersQueryDto,
  ): Promise<PaginatedResult<OrderRow>> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const { rows, total } = await this.ordersRepository.findOrdersByUserId(
      userId,
      limit,
      offset,
    );
    return { data: rows, meta: { total, page, limit } };
  }

  async getOrderById(userId: number, orderId: number): Promise<OrderDetail> {
    const order = await this.ordersRepository.findOrderByIdAndUserId(
      orderId,
      userId,
    );
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return order;
  }
}
