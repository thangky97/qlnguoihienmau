import { Role } from '@config/enum';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../user/service/user.service';
import { FORBIDDEN } from '@config/constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role>('role', [context.getHandler(), context.getClass()]);

    const {
      user: { code },
    } = context.switchToHttp().getRequest();

    const user = await this.usersService.findOne({
      where: {
        code,
      },
    });

    if (!requireRoles.includes(user.role)) {
      throw new ForbiddenException(FORBIDDEN);
    }
    return true;
  }
}
