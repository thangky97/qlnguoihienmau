import { Management, Role } from '@config/enum';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FORBIDDEN } from '@config/constant';
import { UsersService } from '../../user/service/user.service';

@Injectable()
export class AuthorityGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const require: any = this.reflector.getAllAndOverride<Management>('authority', [context.getHandler(), context.getClass()]);

    const {
      user: { code },
    } = context.switchToHttp().getRequest();
    let check = false;
    const user = await this.usersService.findOne({
      where: {
        code,
      },
      relations: { authorities: true },
    });

    if (user.role == Role.ADMIN) {
      check = true;
    } else {
      user.authorities.forEach((authority: any) => {
        if (authority.management == require?.management && authority.action.includes(require.action)) {
          check = true;
          return;
        }
      });
    }

    if (!check) {
      throw new ForbiddenException(FORBIDDEN);
    }
    return check;
  }
}
