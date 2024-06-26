import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { ActiveUserData } from 'iam/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'iam/iam.constant';
import { PermissionType } from '../permission.type';

export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) {
      return true;
    }

    const user: ActiveUserData = context.switchToHttp()[REQUEST_USER_KEY];
    return contextPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
