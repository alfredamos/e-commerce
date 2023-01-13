import { UserType, Gender } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from "class-validator";

export class CustomerUpdateProfile {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  newPassword?: string;
  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}