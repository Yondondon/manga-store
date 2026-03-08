import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CartResponse } from '../common/interfaces';
import { CartRepository } from './cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getCart(userId: number): Promise<CartResponse> {
    const cartId = await this.cartRepository.findCartIdByUserId(userId);
    if (!cartId) {
      return { id: null, items: [] };
    }
    const items = await this.cartRepository.findItemsByCartId(cartId);
    return { id: cartId, items };
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<CartResponse> {
    let cartId = await this.cartRepository.findCartIdByUserId(userId);
    if (!cartId) {
      cartId = await this.cartRepository.createCart(userId);
    }
    await this.cartRepository.upsertItem(cartId, dto.volumeId, dto.quantity);
    const items = await this.cartRepository.findItemsByCartId(cartId);
    return { id: cartId, items };
  }

  async updateItem(
    userId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartResponse> {
    const cartId = await this.cartRepository.findCartIdByUserId(userId);
    if (!cartId) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (item.cart_id !== cartId) {
      throw new ForbiddenException('Item does not belong to your cart');
    }

    await this.cartRepository.updateItemQuantity(itemId, dto.quantity, cartId);
    const items = await this.cartRepository.findItemsByCartId(cartId);
    return { id: cartId, items };
  }

  async removeItem(userId: number, itemId: number): Promise<CartResponse> {
    const cartId = await this.cartRepository.findCartIdByUserId(userId);
    if (!cartId) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (item.cart_id !== cartId) {
      throw new ForbiddenException('Item does not belong to your cart');
    }

    await this.cartRepository.deleteItem(itemId, cartId);
    const items = await this.cartRepository.findItemsByCartId(cartId);
    return { id: cartId, items };
  }
}
