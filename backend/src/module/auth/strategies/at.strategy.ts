import { Status, Verify } from '@config/enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../user/service/user.service';
import { UNAUTHORIZED } from '@config/constant';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne({
      where: {
        username: payload?.username,
      },
    });

    if (user?.status === Status.DEACTIVE) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    if (user?.verify === Verify.UNVERIFIED) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }
    return user;
  }
}
