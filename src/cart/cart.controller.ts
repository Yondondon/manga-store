import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../common/interfaces';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Post('items')
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.sub, itemId, dto);
  }

  @Delete('items/:id')
  removeItem(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(user.sub, itemId);
  }
}
