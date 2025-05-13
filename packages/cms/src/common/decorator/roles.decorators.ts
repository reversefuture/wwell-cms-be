import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Profile } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const ProfilesDecorator = (...roles: Profile[]) =>
  SetMetadata(ROLES_KEY, roles);

export function Profiles(roles: Profile[]) {
  return applyDecorators(ProfilesDecorator(...roles));
}
