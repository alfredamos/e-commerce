import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/customers/dto/update-customer.dto';
import { CustomerChangePasswordDto } from './dto/customer-change-password.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerUpdateProfile } from './dto/customer-update-profile.dto';
import { IsPublic } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Patch('change-password')
  customerChangePassword(@Body() updateAuthDto: CustomerChangePasswordDto) {
    return this.authService.changeCustomerPassword(updateAuthDto);
  }

  @IsPublic()
  @Post('login')
  customerLogin(@Body() createAuthDto: CustomerLoginDto) {
    return this.authService.customerLogin(createAuthDto);
  }

  @IsPublic()
  @Patch('profile/:id')
  customerProfileById(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateCustomerDto,
  ) {
    return this.authService.customerProfileById(id, updateAuthDto);
  }

  @IsPublic()
  @Patch('profile')
  customerProfile(@Body() updateAuthDto: CustomerUpdateProfile) {
    return this.authService.customerProfile(updateAuthDto);
  }

  @IsPublic()
  @Post('signup')
  customerSignup(@Body() createAuthDto: CreateCustomerDto) {
    return this.authService.customerSignup(createAuthDto);
  }

}

