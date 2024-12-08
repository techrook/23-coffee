import { Injectable, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';
  private readonly paystackSecretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initiatePayment(orderId: string, email: string, amount: number) {
    const payload = {
      email,
      amount: amount * 100, // Convert to kobo
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
    const response = await this.httpService.axiosRef.get(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      },
    );

    if (response.data.status) {
      const status = response.data.data.status; // `success`, `failed`, or `abandoned`
      return {
        message: 'Payment verification successful',
        status,
        transaction: response.data.data,
      };
    } else {
      throw new Error('Failed to verify payment');
    }
  }
}
