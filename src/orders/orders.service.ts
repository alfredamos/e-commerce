import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService){}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {

    return await this.prisma.order.create({
      data: {...createOrderDto}
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.prisma.order.findMany({
      include: {
        customer: true,
        product: true
      }
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {id},
      include: {
        customer: true,
        product: true
      }
    })

    if(!order){
      throw new NotFoundException(`Order with ${id} is not found.`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {id},
      
    })

    if(!order){
      throw new NotFoundException(`Order with ${id} is not found.`);
    }
    return this.prisma.order.update({
      where:{id},
      data: {...updateOrderDto}
    });
  }

  async remove(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {id},
      
    })

    if(!order){
      throw new NotFoundException(`Order with ${id} is not found.`);
    }
    return await this.prisma.order.delete({
      where: {id},
    });
  }
}
