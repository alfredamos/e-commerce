import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const id = request.params;
    console.log("orderId : ", id);

    const user = request.user;

    if (!user) {
      throw new BadRequestException(
        'You are not authorized to access this resource.',
      );
    }

    return matchRoles(roles, user?.userType);
  }
}

function matchRoles(roles: string[], userType: UserType): boolean {
  return roles.includes(userType);
}
