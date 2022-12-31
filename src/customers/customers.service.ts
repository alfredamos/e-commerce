import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.prisma.customer.create({
      data: { ...createCustomerDto },
    });
  }

  async findAll(): Promise<Customer[]> {
    return await this.prisma.customer.findMany({
      include: {
        customerOrders: true,
      },
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        customerOrders: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id = ${id} is not found.`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id = ${id} is not found.`);
    }

    return await this.prisma.customer.update({
      where: { id },
      data: { ...updateCustomerDto },
    });
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id = ${id} is not found.`);
    }

    return await this.prisma.customer.delete({
      where: { id },
    });
  }
}
