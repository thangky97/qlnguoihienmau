import { Role, Status, Verify } from '@config/enum';
import { ACCOUNT_DEACTIVE, EMAIL_UNREGISTERED, INVALID_TOKEN, OLD_PASSWORD_INCORRECT } from '@config/constant';
import { MailService } from '@module/mail/mail.service';
import { User } from '@module/user/entity/user.entity';
import { UsersService } from '@module/user/service/user.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetAccessTokenDto } from './dto/get-access-token.dto';
import { SignInGoogleDto } from './dto/sign-in-google.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SignUpCustomerDto } from './dto/sign-up-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ACCOUNT_ALREADY_EXISTS, CODE_EXISTS, ERROR_SYSTEM, EMAIL_ALREADY_EXISTS } from '@config/constant';
import { PREFIX_ID_USER } from '@config/constant';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Company } from '@module/company/entity/company.entity';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async signUp(body: SignUpDto) {
    const code = uuidv4();
    const hash = this.hashPassword(body.password);

    // await this.usersService.create({
    //   ...body,
    //   code,
    //   password: hash,
    // });
    const token = this.jwtService.sign(
      {
        code,
        fullname: body.fullname,
        email: body.email,
      },
      {
        secret: process.env.VERIFY_EMAIL_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );
    const href = `${process.env.FE_URL}/auth/verify-email?token=${token}`;

    await this.mailService.sendMail(body.email, {
      subject: 'Verify Email',
      html: `<p>Please click here to verify email: <a href="${href}">Link</a></p>`,
    });
  }

  async authenticate(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      return;
    }
    return user;
  }

  async signIn(user: User) {
    const payload = {
      username: user.username,
      role: user.role,
    };
    const data = await this.usersService.findOne({ where: { code: user.code }, relations: { authorities: true } });
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '2d',
    });
    return { access_token, refresh_token, ...data };
  }

  async signUpCustomer(User: SignUpCustomerDto) {
    User.role = Role.CUSTOMER;
    User.verify = Verify.UNVERIFIED;
    User.status = Status.ACTIVE;
    const check_username = await this.userRepository.findOne({
      where: { username: User.username },
    });

    if (check_username) {
      throw new BadRequestException(ACCOUNT_ALREADY_EXISTS);
    }

    const check_email = await this.userRepository.findOne({
      where: { username: User.email },
    });
    const admin = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (check_email) {
      throw new BadRequestException(EMAIL_ALREADY_EXISTS);
    }

    const format_code = '00000';

    let generateId: string = PREFIX_ID_USER[User.role] + '00001';

    const filter_user = await this.userRepository.find({
      where: {
        code: Like(`%${PREFIX_ID_USER[User.role]}%`),
      },
    });

    if (filter_user.length > 0) {
      const last_index = Number(filter_user[filter_user.length - 1].code.replace(PREFIX_ID_USER[User.role], '')) + 1;
      generateId = PREFIX_ID_USER[User.role] + format_code.substring(0, 5 - last_index.toString().length) + last_index;
    }
    const check_code = await this.userRepository.findOne({
      where: { code: generateId },
    });
    if (check_code) {
      throw new BadRequestException(CODE_EXISTS);
    }

    const resultUser = await this.userRepository.save({ ...User, code: generateId });
    if (resultUser) {
      await this.mailService.sendMail(
        admin?.email,
        {
          subject: `Thông báo Công ty ${resultUser?.name} đã tạo tài khoản cần xác nhận`,
          html: `<p>Dear: Admin </p>
        <p> Công ty ${resultUser?.code}-${resultUser?.name} đã được tạo trên hệ thống , vui lòng kiểm tra và xác nhận đăng ký</p>
        <p>Bạn có thể thực hiện xác nhận bằng cách truy cập <a href="https://1tour.asia/apps/guest/list">https://1tour.asia/apps/guest/list</a> để xác nhận tài khoản đã tạo.</p>
        `,
        },
        '1 Agent',
      );
      const comapany = await this.companyRepository.findOne({
        where: {
          id: resultUser?.company_id,
        },
      });
      const data = {
        email: resultUser?.email,
        first_name: resultUser?.name,
        last_name: comapany ? comapany?.name : '1TOUR',
      };
      await this.usersService.addMemberToAudience(data);
      return resultUser;
    } else {
      throw new BadRequestException(ERROR_SYSTEM);
    }
  }

  async signInGoogle(userGoogle: SignInGoogleDto) {
    let result: User;
    const user = await this.usersService.findOne({ where: { username: userGoogle.google_email } });

    if (!user) {
      result = await this.usersService.create({
        name: userGoogle.google_last_name,
        username: userGoogle.google_email,
        email: userGoogle.google_email,
        authorities: [],
        password: userGoogle.google_id,
        role: Role.CUSTOMER,
        company_tax_code: ' ',
        referral_source_id: null,
        department_id: 5,
        phone: ' ',
        address: ' ',
        company_id: null,
        branch_id: null,
      });
    } else {
      result = user;
      if (result.status === Status.DEACTIVE) {
        throw new UnauthorizedException(ACCOUNT_DEACTIVE);
      }
    }

    const payload = {
      username: result.username,
      role: result.role,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '2d',
    });

    return { access_token, refresh_token, ...result };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.usersService.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException(EMAIL_UNREGISTERED);
    }

    const payload = {
      username: user.username,
      role: user.role,
    };
    // token duration: 300s
    const token = this.jwtService.sign(payload, { expiresIn: 300 });

    await this.mailService.sendMail(body.email, {
      subject: 'Reset Password',
      html: `<p>Please click here to reset password: <a href="https://1tour.asia/reset-password/${token}">https://1tour.asia/reset-password/${token}</a> <p>The function only works for 5 minutes<p/></p>`,
    });

    return {
      message: 'oke',
      token,
    };
  }

  async resetPassword(body: ResetPasswordDto, user: User) {
    const { password } = body;

    if (user) {
      return await this.userRepository.save({ ...user, password });
    }
  }

  async changePassword(body: ChangePasswordDto, user: User) {
    if (body.old_password != user.password) {
      throw new BadRequestException(OLD_PASSWORD_INCORRECT);
    }
    return await this.usersService.save({ ...user, password: body.new_password });
  }

  getAccessToken(body: GetAccessTokenDto) {
    let payload;
    try {
      payload = this.jwtService.verify(body.refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      throw new BadRequestException(INVALID_TOKEN);
    }

    delete payload.exp;
    delete payload.iat;

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '600s',
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async verifyEmail(body: VerifyEmailDto) {
    let payload;
    try {
      payload = this.jwtService.verify(body.token, {
        secret: process.env.VERIFY_EMAIL_TOKEN_SECRET,
      });
    } catch (error) {
      throw new BadRequestException(INVALID_TOKEN);
    }
  }
}
