import { IsString, IsInt, Min } from 'class-validator';

export class RemoveCartDto {
  @IsString()
  coffeeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class RemoveUserCartDto {
  @IsString()
  cartId: string;  // Add cartId to the DTO

  @IsString()
  coffeeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}


