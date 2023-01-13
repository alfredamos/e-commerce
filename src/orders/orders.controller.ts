import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { CanModifyGuard } from '../auth/guards/can-modify.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { prisma } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private prisma: PrismaService,
  ) {}

  @Roles('Admin', 'Customer')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(CanModifyGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(CanModifyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(CanModifyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}


