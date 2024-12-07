import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../types/order-status.types';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  totalPrice: number;
}
