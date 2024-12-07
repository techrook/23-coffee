// update-cart.dto.ts

import { IsString, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsString()
  cartId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
