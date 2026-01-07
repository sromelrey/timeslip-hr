import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/types/enums';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access a route.
 * @example @Roles(UserRole.ADMIN)
 * @example @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
