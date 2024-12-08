import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoffeeModule } from './coffee/coffee.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CoffeeModule,
    CartModule,
    OrderModule,
    PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
