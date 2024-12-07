import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserCartDto } from './DTO/create-cart.dto';
import { RemoveCartDto, RemoveUserCartDto } from './DTO/remove-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve the current user's shopping cart
   */
  async getCart(userId: string) {
    this.logger.log(`Fetching cart for user ${userId}`);
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

    if (!cart) {
      const newCart = await this.prisma.cart.create({
        data: { userId },
      });
      this.logger.log(`Created a new cart for user ${userId}`);

      return {
        message: 'Cart successfully fetched',
        data: newCart,
      };
    }

    return {
      message: 'Cart successfully fetched',
      data: cart,
    };
  }

  /**
   * Add a product to the cart
   */
  async addToCart(createUserCartDto: CreateUserCartDto) {
    this.logger.log(`Adding coffee to cart `);

    const coffee = await this.prisma.coffee.findUnique({
      where: { id: createUserCartDto.coffeeId },
    });
    if (!coffee) {
      this.logger.warn(
        `Coffee not found for coffeeId ${createUserCartDto.coffeeId}`,
      );
      throw new NotFoundException('Coffee not found');
    }

    try {
      let cart = await this.prisma.cart.findFirst({
        where: { userId: createUserCartDto.userId },
      });
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: { coffeeId: createUserCartDto.coffeeId, cartId: cart.id },
      });

      if (existingCartItem) {
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + createUserCartDto.quantity,
          },
        });
        this.logger.log(`Updated coffee quantity in cart`);
      } else {
        await this.prisma.cartItem.create({
          data: {
            coffeeId: createUserCartDto.coffeeId,
            quantity: createUserCartDto.quantity,
            cartId: cart.id,
          },
        });
        this.logger.log(`Added coffee to cart `);
      }

      return {
        message: 'Coffee added to cart successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to add coffee to cart `, error.stack);
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  /**
   * Remove a product from the cart
   */
  async removeFromCart(userId: string, removeUserCartDto: RemoveUserCartDto) {
    this.logger.log(`Removing coffee from cart `);

    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      this.logger.warn(`Cart not found`);
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        coffeeId: removeUserCartDto.coffeeId,
      },
    });

    if (!cartItem) {
      this.logger.warn(`Coffee not found`);
      throw new NotFoundException('Coffee not found in cart');
    }

    if (cartItem.quantity > removeUserCartDto.quantity) {
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity - removeUserCartDto.quantity,
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
  /**
   * Checkout the cart
   */
  async checkoutCart(userId: string) {
    this.logger.log(`Processing checkout for user ${userId}`);

    try {
      // Get the cart and include coffee details
      const cart = await this.prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              coffee: true, // Include coffee details for each item
            },
          },
        },
      });

      // Check if the cart is empty
      if (!cart || cart.items.length === 0) {
        this.logger.warn(`Cannot checkout empty cart for user ${userId}`);
        throw new BadRequestException('Your cart is empty');
      }

      // Calculate total price
      const totalPrice = cart.items.reduce(
        (acc, item) => acc + item.coffee.price * item.quantity,
        0,
      );

      // Mock payment processing (you can replace with actual logic)
      // const paymentSuccessful = await this.processPayment(userId, totalPrice);
      // if (!paymentSuccessful) {
      //   this.logger.warn(`Payment failed for user ${userId}`);
      //   throw new BadRequestException('Payment failed');
      // }

      // Prepare the order items
      const orderItems = cart.items.map((item) => ({
        coffeeId: item.coffeeId,
        quantity: item.quantity,
        price: item.coffee.price,
      }));

      // Create the order
      const order = await this.prisma.order.create({
        data: {
          userId,
          total: totalPrice,
          items: {
            create: orderItems, // Add items to the order
          },
        },
      });
      const cartItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
        },
      });

      // Update cart items: Instead of deleting, we just update the quantity in cart items
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });

      // Optionally clear the cart after checkout if you want
      // await this.prisma.cart.update({
      //   where: { userId },
      //   data: { items: { deleteMany: {} } },
      // });

      this.logger.log(`Checkout completed successfully for user ${userId}`);
      return { message: 'Checkout successful', order };
    } catch (error) {
      this.logger.error(
        `Error processing checkout for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Unable to process checkout');
    }
  }

  // Simulate payment processing
  // private async processPayment(userId: string, totalPrice: number): Promise<boolean> {
  //   // Integrate payment logic (e.g., Stripe, PayPal)
  //   return true;
  // }
}
