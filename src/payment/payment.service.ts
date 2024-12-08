import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';// Adjust based on your ORM setup

@Injectable()
export class PaymentService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';
  private readonly paystackSecretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService, // Inject your database service
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initiatePayment(orderId: string, email: string) {
    // Fetch the order using the orderId
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    const amount = order.total; // Use the total from the order

    const payload = {
      email,
      amount: amount, 
      reference: `order_${orderId}_${Date.now()}`, // Unique reference
    };

    const response = await this.httpService.axiosRef.post(
      `${this.paystackBaseUrl}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      },
    );

    if (response.data.status) {
      return {
        message: 'Payment initiated successfully',
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
      };
    } else {
      throw new Error('Failed to initiate payment');
    }
  }

  async verifyPayment(reference: string) {
    try {
      
    
    const response = await this.httpService.axiosRef.get(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      },
    );

    console.log('Response from Paystack:', response.data);

    if (response.data.status) {
      const status = response.data.data.status; // `success`, `failed`, or `abandoned`

      // Update the order status in the database
      const orderId = this.extractOrderIdFromReference(reference);
      
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status === 'success' ? 'completed' : 'cancelled' },
      });

      return {
        message: 'Payment verification successful',
        status,
        transaction: response.data.data,
      };
    } else {
      throw new Error('Failed to verify payment');
    }
  } catch (error) {
     console.log(error) 
     throw new Error('Failed to verify payment');
  }
  }

  private extractOrderIdFromReference(reference: string): string {
    // Example: Extract the order ID from `order_<orderId>_<timestamp>`
    const parts = reference.split('_');
    if (parts.length < 2) {
      throw new Error('Invalid payment reference format');
    }
    return parts[1];
  }
}
