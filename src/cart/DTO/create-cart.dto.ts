// create-cart.dto.ts

import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartDto {
  @IsString()
  userId: string;

  @IsString()
  coffeeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
