import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CustomerLoginDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string;
    @IsNotEmpty()
    @IsString()
    password:string;
    
}