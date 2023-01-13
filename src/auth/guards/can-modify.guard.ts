import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UuidTool } from 'uuid-tool';

@Injectable()
export class CanModifyGuard implements CanActivate {
  constructor(public prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const user = request.user;
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundException('Order does not exist');

    const isEqual = UuidTool.compare(user?.id, order?.customerId!);
    const isAdmin = user?.userType === UserType.Admin;
    if (isEqual || isAdmin) return true;

    return false;
  }
}
