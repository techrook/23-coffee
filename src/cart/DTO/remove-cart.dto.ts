import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class RemoveCartDto {
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsNotEmpty()
  @IsUUID()
  coffeeId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1) // Ensures quantity is at least 1
  quantity: number;
}

