import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Profile } from '../../../../prisma/client';
import { IS_PUBLIC_KEY } from 'common/decorator/public.decorator';
import { ROLES_KEY } from 'common/decorator/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the endpoint is decorated as isPublic
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Get the required profiles from the decorator
    const requiredProfiles = this.reflector.getAllAndOverride<Profile[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no profiles are required, allow access
    if (!requiredProfiles) {
      return true;
    }

    // Get the user from the request
    const { user } = context.switchToHttp().getRequest();

    // Check if the user has any of the required profiles
    return user.userProfiles.some((userProfile) =>
      requiredProfiles.some((requiredProfile) => requiredProfile.id === userProfile.profileId)
    );
  }
}