import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './DTO/initiate-payment.dto';
import { VerifyPaymentDto } from './DTO/verify-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    const { orderId, email } = initiatePaymentDto;

    try {
      // Fetch the order amount and initiate the payment
      return await this.paymentService.initiatePayment(orderId, email);
    } catch (error) {
      // Handle error if order not found or any other issues
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
  }

  @Post('verify')
  async verifyPayment(@Body() referenceObj: VerifyPaymentDto) {
    const reference= referenceObj.reference
    return this.paymentService.verifyPayment(reference);
  }
}
