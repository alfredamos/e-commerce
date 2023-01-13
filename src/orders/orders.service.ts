import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order} from '@prisma/client';
import { UuidTool } from 'uuid-tool';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customerId = createOrderDto.customerId; //---> CustomerId

    //----> Get the customer
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with id = ${customerId} is not found.`,
      );
    }

    const productId = createOrderDto.productId; //----> ProductId

    //----> Get the product.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} is not found`);
    }

    return await this.prisma.order.create({
      data: { ...createOrderDto },
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            userType: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            userType: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });


    if (!order) {
      throw new NotFoundException(`Order with ${id} is not found.`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const customerId = updateOrderDto.customerId; //---> CustomerId

    const isEqual = UuidTool.compare(id, updateOrderDto.id);
    if (!isEqual) throw new BadRequestException('Id mismatch');

    //----> Get the customer
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with id = ${customerId} is not found.`,
      );
    }

    const productId = updateOrderDto.productId; //----> ProductId

    //----> Get the product.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} is not found`);
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ${id} is not found.`);
    }
    return this.prisma.order.update({
      where: { id },
      data: { ...updateOrderDto },
    });
  }

  async remove(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ${id} is not found.`);
    }
    return await this.prisma.order.delete({
      where: { id },
    });
  }
}
