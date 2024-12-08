import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UpdateOrderStatusDto } from './DTO/update-order-status.dto';
import { OrderStatus } from './types/order-status.types';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders(@CurrentUser('userId') userId: string) {
    return this.ordersService.getOrdersForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  async getOrderDetails(@CurrentUser('userId') userId: string, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(userId, orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/orders')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('admin/orders/:id')
  async updateOrderStatus(@Param('id') orderId: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}

