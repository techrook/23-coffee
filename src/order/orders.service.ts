import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderStatusDto } from './DTO/update-order-status.dto';
import { OrderStatus } from './types/order-status.types';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch all orders for a specific user
  async getOrdersForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Fetch a specific order by ID for a user
  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  // Fetch all orders in the system (admin use case)
  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update the status of an order
  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }


    // Update the order's status
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
      },
    });
  }
}
