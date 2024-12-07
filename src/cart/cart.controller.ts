import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Patch,
    UseGuards,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  import { CreateCartDto, CreateUserCartDto } from './DTO/create-cart.dto';
  import { RemoveCartDto, RemoveUserCartDto } from './DTO/remove-cart.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator'; 
  
  @Controller('cart')
  @UseGuards(JwtAuthGuard) 
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
  /**
   * Retrieve the current user's shopping cart
   */

    @Get()
    async getCart(@CurrentUser('userId') userId: string) {
      console.log(userId)
      return this.cartService.getCart(userId);
    }
  
      /**
   * Add a product to the cart
   */
    @Post()
    async addToCart(
      @CurrentUser('id') userId: string,
      @Body() createCartDto: CreateCartDto,
    ) {
      const userCartDto = new CreateUserCartDto();
      userCartDto.userId = userId;
      userCartDto.coffeeId = createCartDto.coffeeId;
      userCartDto.quantity = createCartDto.quantity;
  
      // Pass the instance to the service
      return this.cartService.addToCart(userCartDto);
    }
  
      /**
   * Remove a product from the cart
   */
    @Delete(':cartId')
    async removeFromCart(
      @CurrentUser('id') userId: string,
      @Param('cartId') cartId: string, 
      @Body() removeCartDto: RemoveCartDto,
    ) {
      const removeUserCartDto: RemoveUserCartDto = {
        cartId,
        ...removeCartDto,
      };
      return this.cartService.removeFromCart(userId, removeUserCartDto);
    }
  
  /**
   * Checkout the cart
   */
    @Post('checkout')
    async checkoutCart(@CurrentUser('userId') userId: string) {
      return this.cartService.checkoutCart(userId);
    }
  }
  