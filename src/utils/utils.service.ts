import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderUtil } from './dto/order-util.dto';

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService){}

  async findAllOrdersByCustomerId(customerId: string): Promise<OrderUtil[]> {
    console.log({customerId})
    return await this.prisma.order.findMany({
      where: {customerId},
      select: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          }
        },
        product: {
          select:{
            name: true,
            price: true,           
            description: true,
            Category: {
              select: {
                name: true,
              }
            }
          }
        },
        quantity: true,
        status: true,
      }
    });
  }

  async findAllOrdersByProductId(productId: string): Promise<OrderUtil[]> {
        
    return await this.prisma.order.findMany({
      where: { productId },
      select: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,           
            description: true,
            Category: {
              select: {
                name: true,
              },
            },
          },
        },
        quantity: true,
        status: true,
      },
    });
  }
}
