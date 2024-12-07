import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './DTO/create-cart.dto';
import { RemoveCartDto } from './DTO/remove-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get current user's cart
  async getCart(userId: string) {
    this.logger.log(`Fetching cart for user ${userId}`);
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            coffee: true, // Include coffee details for each cart item
          },
        },
      },
    });

    if (!cart) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new NotFoundException('Cart not found');
    }

    return {
      message: 'Cart successfully fetched',
      data: cart,
    };
  }

  // Add a product to the cart
  async addToCart(userId: string, createCartDto: CreateCartDto) {
    this.logger.log(`Adding coffee to cart for user ${userId}`);

    const coffee = await this.prisma.coffee.findUnique({
      where: { id: createCartDto.coffeeId },
    });
    if (!coffee) {
      this.logger.warn(`Coffee not found for user ${userId}`);
      throw new NotFoundException('Coffee not found');
    }

    try {
      let cart = await this.prisma.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
        });
      }

      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: { coffeeId: createCartDto.coffeeId, cartId: cart.id },
      });

      if (existingCartItem) {
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + createCartDto.quantity,
          },
        });
        this.logger.log(`Updated coffee quantity in cart for user ${userId}`);
      } else {
        await this.prisma.cartItem.create({
          data: {
            coffeeId: createCartDto.coffeeId,
            quantity: createCartDto.quantity,
            cartId: cart.id,
          },
        });
        this.logger.log(`Added coffee to cart for user ${userId}`);
      }

      return {
        message: 'Coffee added to cart successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to add coffee to cart for user ${userId}`, error.stack);
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  // Remove a product from the cart
  async removeFromCart(userId: string, removeCartDto: RemoveCartDto) {
    this.logger.log(`Removing coffee from cart for user ${userId}`);

    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        coffeeId: removeCartDto.coffeeId,
      },
    });

    if (!cartItem) {
      this.logger.warn(`Coffee not found in cart for user ${userId}`);
      throw new NotFoundException('Coffee not found in cart');
    }

    if (cartItem.quantity > removeCartDto.quantity) {
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity - removeCartDto.quantity,
        },
      });
      this.logger.log(`Decreased coffee quantity in cart for user ${userId}`);
    } else {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      this.logger.log(`Removed coffee from cart for user ${userId}`);
    }

    return {
      message: 'Coffee removed from cart successfully',
    };
  }

  // Proceed to checkout
  async checkoutCart(userId: string) {
    this.logger.log(`Processing checkout for user ${userId}`);

    try {
      const cart = await this.prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              coffee: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        this.logger.warn(`Cannot checkout empty cart for user ${userId}`);
        throw new BadRequestException('Your cart is empty');
      }

      const totalPrice = cart.items.reduce(
        (acc, item) => acc + item.coffee.price * item.quantity,
        0
      );

      const paymentSuccessful = await this.processPayment(userId, totalPrice);

      if (!paymentSuccessful) {
        this.logger.warn(`Payment failed for user ${userId}`);
        throw new BadRequestException('Payment failed');
      }

      const orderItems = cart.items.map(item => ({
        coffeeId: item.coffeeId,
        quantity: item.quantity,
        price: item.coffee.price,
        // Add the relation to the order, assuming 'orderId' is required in 'OrderItemCreateWithoutOrderInput'
        order: { connect: { id: cart.id } },
      }));

      const order = await this.prisma.order.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: orderItems,  // Pass the updated orderItems
          },
        },
      });

      await this.prisma.cart.delete({
        where: { id: cart.id },
      });

      this.logger.log(`Checkout completed successfully for user ${userId}`);
      return { message: 'Checkout successful', order };
    } catch (error) {
      this.logger.error(`Error processing checkout for user ${userId}`, error.stack);
      throw new InternalServerErrorException('Unable to process checkout');
    }
  }

  // Simulate payment gateway
  private async processPayment(userId: string, totalPrice: number): Promise<boolean> {
    // Simulate payment processing logic
    return true;
  }
}
