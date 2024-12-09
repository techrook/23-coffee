import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

    /**
   * Fetch all orders for a specific user
   *  */ 
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders(@CurrentUser('userId') userId: string) {
    return this.ordersService.getOrdersForUser(userId);
  }

    /**
   * Fetch a specific order by ID for a user
   *  */
  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  async getOrderDetails(@CurrentUser('userId') userId: string, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(userId, orderId);
  }
 /**
   *  Fetch all orders admin
   *  */ 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/orders')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

    /**
   * Update the status of an order admin
   *  */ 

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('admin/orders/:id')
  async updateOrderStatus(@Param('id') orderId: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}

