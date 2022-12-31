import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

/* const Status: { [x: string]: 'DELIVERED' | 'SHIPPED' | 'PENDING'} = {
    DELIVERED: 'DELIVERED',
    SHIPPED: 'SHIPPED',
    PENDING: 'PENDING',
  }
  
  type Status = typeof Status[keyof typeof Status] */

enum Status {
  DELIVERED = 'DELIVERED',
  PENDING = 'PENDING',
  Shipped = 'SHIPPED',
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  customerId: string;
  @IsString()
  @IsOptional()
  productId: string;
  @IsEnum(Status)
  @IsOptional()
  status: Status;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
