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
  import { CreateCartDto } from './DTO/create-cart.dto';
  import { RemoveCartDto } from './DTO/remove-cart.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'; // Adjust based on your actual guard
import { CurrentUser } from '../auth/decorator/current-user.decorator'; // Adjust based on your setup
  
  @Controller('cart')
  @UseGuards(JwtAuthGuard) // Ensure the user is authenticated
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    // Get current user's cart
    @Get()
    async getCart(@CurrentUser('id') userId: string) {
      return this.cartService.getCart(userId);
    }
  
    // Add a product to the cart
    @Post()
    async addToCart(
      @CurrentUser('id') userId: string,
      @Body() createCartDto: CreateCartDto,
    ) {
      return this.cartService.addToCart(userId, createCartDto);
    }
  
    // Remove a product from the cart
    @Delete()
    async removeFromCart(
      @CurrentUser('id') userId: string,
      @Body() removeCartDto: RemoveCartDto,
    ) {
      return this.cartService.removeFromCart(userId, removeCartDto);
    }
  
    // Proceed to checkout
    @Post('checkout')
    async checkoutCart(@CurrentUser('id') userId: string) {
      return this.cartService.checkoutCart(userId);
    }
  }
  