import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule],
  providers: [PaymentService, ConfigService],
  controllers:[PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
