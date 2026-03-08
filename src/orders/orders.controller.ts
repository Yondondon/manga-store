import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../common/interfaces';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CheckoutDto } from './dto/checkout.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: JwtPayload, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.sub, dto);
  }

  @Get()
  getOrders(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetOrdersQueryDto,
  ) {
    return this.ordersService.getOrders(user.sub, query);
  }

  @Get(':id')
  getOrderById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.getOrderById(user.sub, orderId);
  }
}
