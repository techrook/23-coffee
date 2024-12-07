import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true; // If no roles are specified, allow all authenticated users

    const request = context.switchToHttp().getRequest();
    const user = request.user;


    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    // Normalize role strings to lowercase for comparison
    const userRole = user.role.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
