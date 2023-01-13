import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerResponse } from './dto/customer-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerResponse> {
    const { email, password } = createCustomerDto;
    //----> Check for existence of user.

    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    //----> Hash password for user
    const hashedPassword = await bcrypt.hash(password, 10);

    //----> Create new user
    const newUser = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        password: hashedPassword,
      },
    });

    //----> Send the token to the client.
    return {
      id: newUser.id,
      name: newUser.name,
      userType: newUser.userType,
      message: 'Customer signup is successful.',
    };
  }

  async findAll(): Promise<CustomerResponse[]> {
    return await this.prisma.customer.findMany({
      select: {        
        id: true,
        name: true,
        userType: true,
      },
    });
  }

  async findOne(id: string): Promise<CustomerResponse> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id = ${id} is not found.`);
    }
    return {
      id: customer.id, 
      name: customer.name, 
      userType: customer.userType
    };
  }

  
  async remove(id: string): Promise<CustomerResponse> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id = ${id} is not found.`);
    }

    return await this.prisma.customer.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        userType: true,
      },
    });
  }
}
