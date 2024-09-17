import { Status,Verify } from '@config/enum';
import { User } from '@module/user/entity/user.entity';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ACCOUNT_DEACTIVE, USERNAME_OR_PASSWORD_NOT_MATCH,ACCOUNT_UNVERIFIED } from '@config/constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.authenticate(username, password);
    if (!user) {
      throw new BadRequestException(USERNAME_OR_PASSWORD_NOT_MATCH);
    }

    if (user.status === Status.DEACTIVE) {
      throw new UnauthorizedException(ACCOUNT_DEACTIVE);
    }

    if (user.verify === Verify.UNVERIFIED) {
      throw new UnauthorizedException(ACCOUNT_UNVERIFIED);
    }

    return user;
  }
}
