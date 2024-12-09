import { SetMetadata } from '@nestjs/common';

/**
 * Define roles allowed for a specific route.
 * @param roles 
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);