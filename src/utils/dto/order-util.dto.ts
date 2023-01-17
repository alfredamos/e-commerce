import { Status } from '@prisma/client';
import { Customer } from './customer-util.dto';
import { Product } from './product-util.dto';

export class OrderUtil{
    customer: Customer | null;
    product: Product | null;
    quantity: number;
    status: Status;
}




