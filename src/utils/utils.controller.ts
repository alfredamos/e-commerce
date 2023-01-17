import { Controller, Get, Param} from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Roles('Admin', 'Customer')
  @Get('customer-orders/:customerId')
  findAllOrdersByCustomerId(@Param('customerId') customerId: string) {
    return this.utilsService.findAllOrdersByCustomerId(customerId);
  }

  @Roles('Admin', 'Customer')
  @Get('product-orders/:productId')
  findAllOrdersByProductId(@Param('productId') productId: string) {
    return this.utilsService.findAllOrdersByProductId(productId);
  }
}
