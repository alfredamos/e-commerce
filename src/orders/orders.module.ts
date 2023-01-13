import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {PrismaModule} from '../prisma/prisma.module';
import { CanModifyGuard } from 'src/auth/guards/can-modify.guard';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService, CanModifyGuard]
})
export class OrdersModule {}
