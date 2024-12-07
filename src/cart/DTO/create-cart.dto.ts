// create-cart.dto.ts

import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartDto {

  @IsString()
  coffeeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateUserCartDto extends CreateCartDto {
  @IsString()
  userId: string;

}
