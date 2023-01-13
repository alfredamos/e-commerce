import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/customers/dto/update-customer.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config/dist';
import { CustomerResponse } from 'src/customers/dto/customer-response.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { CustomerChangePasswordDto } from './dto/customer-change-password.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerUpdateProfile } from './dto/customer-update-profile.dto';
import { UuidTool } from 'uuid-tool';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async customerSignup(
    createAuthDto: CreateCustomerDto,
  ): Promise<CustomerResponse> {
    const { email, password } = createAuthDto;
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
        ...createAuthDto,
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

  async customerLogin(
    createAuthDto: CustomerLoginDto,
  ): Promise<CustomerResponse> {
    const { email, password } = createAuthDto;
    //----> Check for existence of user.

    console.log({ createAuthDto });

    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    //----> Check for correctness of password.
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    const customerPayload: CustomerResponse = { id: user.id, name: user.name, userType: user.userType };
    const token = this.jwt.sign(customerPayload);    

    return {
      id: user.id,
      name: user.name,
      userType: user.userType,
      message: 'Login is successful.',
      token,
    };
  }

  async changeCustomerPassword(updateAuthDto: CustomerChangePasswordDto) {
    const { email, oldPassword, newPassword, confirmPassword } = updateAuthDto;

    if (newPassword.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException(
        'New password  does not match confirm password.',
      );
    }

    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    //----> Check for correctness of password.
    const oldHashedPassword = user.password;
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword);

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    //----> Hash new password.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //----> Update user.
    const updatedUser = await this.prisma.customer.update({
      where: { email },
      data: { ...user, password: hashedPassword },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      userType: updatedUser.userType,
      message: 'Password is successful changed.',
    };
  }

  async customerProfileById(id: string, updateAuthDto: UpdateCustomerDto) {
    const { email, password, newPassword, id: customerId } = updateAuthDto;

    const isEqual = UuidTool.compare(id, customerId);

    if (!isEqual) {
      throw new BadRequestException('Id mismatch');
    }

    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (!password) {
      throw new BadRequestException('Please provide password');
    }

    //----> Check for correctness of password.
    const oldHashedPassword = user.password;
    const isValid = await bcrypt.compare(password, oldHashedPassword);

    if (!isValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    //----> Hash new password.
    const hashedPassword = await bcrypt.hash(newPassword!, 10);

    delete updateAuthDto.newPassword;

    //----> Update user.
    const updatedUser = await this.prisma.customer.update({
      where: { email },
      data: { ...updateAuthDto, password: hashedPassword },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      userType: updatedUser.userType,
      message: 'Profile is successful updated.',
    };
  }

  async customerProfile(
    updateAuthDto: CustomerUpdateProfile,
  ): Promise<CustomerResponse> {
    const { email, password, newPassword } = updateAuthDto;

    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (!password) {
      throw new BadRequestException('Please provide password');
    }

    //----> Check for correctness of password.
    const oldHashedPassword = user.password;
    const isValid = await bcrypt.compare(password, oldHashedPassword);

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    //----> Hash new password.
    const hashedPassword = await bcrypt.hash(newPassword!, 10);

    delete updateAuthDto.newPassword;

    //----> Update user.
    const updatedUser = await this.prisma.customer.update({
      where: { email },
      data: { ...updateAuthDto, password: hashedPassword, id: user.id },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      userType: updatedUser.userType,
      message: 'Profile is successful updated.',
    };
  }
}