import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
  @IsNotEmpty()
  @IsString()
  confirmPassword!: string;
}
