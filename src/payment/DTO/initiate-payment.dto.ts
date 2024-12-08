// initiate-payment.dto.ts
import { IsString } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  email: string;
}
