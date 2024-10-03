import { PREFIX_ID_USER } from '@config/constant';
import { Role } from '@config/enum';
import { CommonService } from '@module/common/common.service';
import { UserDto } from '@module/user/dto/user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACCOUNT_ALREADY_EXISTS, CODE_EXISTS, EMAIL_ALREADY_EXISTS } from '@config/constant';
import { FindOneOptions, Like, Not, Repository } from 'typeorm';
import { UserFilterDto } from '../dto/user.filter.dto';
import { UserProfileDto } from '../dto/user.profile.dto';
import { UserQueryDto, UserQueryCustomerDto } from '../dto/user.query.dto';
import { User } from '../entity/user.entity';
import { Authority } from '../entity/authority.entity';
import { MailService } from '@module/mail/mail.service';
import axios from 'axios';
import querystring from 'querystring';
import { ZaloDto } from '../dto/zalo.dto';
import { AddMemberToAudienceDto } from '../dto/addmemberaudience.dto';
import { MailDto } from '../dto/mail.dto';
import { Job } from '@module/job/entity/job.entity';
@Injectable()
export class UsersService {
  private refreshToken: string;
  private app_accessToken: string;
  private baseUrlZalo: string;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
    @InjectRepository(Authority) private readonly AuthorityRepository: Repository<Authority>,
    private readonly mailService: MailService,
    @InjectRepository(Authority) private readonly authRepository: Repository<Authority>,
  ) {
    this.refreshToken =
      'XHhwCww9eqc57FmrgOclJuyTy3-dbF8tu7lrDCYe_1oxFCWbrFQILAStgYN8mOjKiak6CC-RiXA-MR8voQw3FRfGWpZyaT0pr4xh0w-OmGxTKSa_fw7uCun8v4xybUnVr6tj8hlxpm7J3PTmeF-uU_mlYKY6iOqih5AV4T2WWG-UICSYzeIQAAX6lZFKg9u_iME10UM5nnUBTjKInfhBAP18p2l2YVKXxa7IB9sZ_rowO-97q8pZTejZx0pPa-bpy63t3AQJpIpIJkqdb96tFxzqjJAPgeGIvqY04Rs2tspeLVDenPUkJum1bKBMu8Tek3U3LUBoYdkx7THexUMBISKWaMgAvBbA_16qQQ7blb3RUwThde-aODHgZ6UxYgHeuHw44fVIh6Bx1Ofi7wThIQwJe4q';
    this.app_accessToken =
      'uwvV3KHza5VZg5aBGtsSKUcfLG5DOELTv_5BTWTT_dBnqZ9J9K-MV-7TA5irROK6y-KM7nLks2xH_cvg5rkdRlt42Lq85v1VyRfSRbefztUYZMT6TLFMTgg77L1H5TDrjADyBXzsstxzfMnE9NkWK__g9LLTEk1IbkrUP7rycsoOn2SmCbQsBC_y6Z4BOg8ypT0b7n47ZK7ueY50M1UM7OY7AaLG1hP_jOCPTnCthqVAboj13J_lOk-AKqynFVvioFTCDJaYrpdYbMjX80EXFjUG33C0ByCzsvnk13qQnmBwhKCcNNZ75OsdPGbrTz4NeTvW4m8Bw2hmlaGKAmc0IVgb5KCkTxXZtyO9CnbFp16_ud0rIa_xExltII0STum0qFC16YeiiJhskpOw9cMd5UtRR4oJv_rfH6UJKm';
    this.baseUrlZalo = `https://${process.env.dcMail}.api.mailchimp.com/3.0`;
  }

  async findOne(query: FindOneOptions): Promise<User> {
    return await this.userRepository.findOne(query);
  }

  setTokens(app_accessToken: string, refreshToken: string): void {
    this.refreshToken = refreshToken;
    this.app_accessToken = app_accessToken;
  }

  // Hàm để lấy giá trị của accessToken và token
  getTokens(): { app_accessToken: string; refreshToken: string } {
    return { app_accessToken: this.app_accessToken, refreshToken: this.refreshToken };
  }

  async create(User: UserDto) {
    const check_username = await this.userRepository.findOne({
      where: { username: User.username },
    });

    if (check_username) {
      throw new BadRequestException(ACCOUNT_ALREADY_EXISTS);
    }

    const check_email = await this.userRepository.findOne({
      where: { username: User.email },
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

    const result = await this.userRepository.save({ ...User, code: generateId });
    if (result) {
      const data = {
        email: result?.email,
        first_name: result?.name,
        last_name: 'BV',
      };
      await this.addMemberToAudience(data);
    }
    return result;
  }

  async registerValidate(User: UserDto) {
    const check_username = await this.userRepository.findOne({
      where: { username: User.username },
    });

    if (check_username) {
      throw new BadRequestException(ACCOUNT_ALREADY_EXISTS);
    }

    const check_email = await this.userRepository.findOne({
      where: { username: User.email },
    });

    if (check_email) {
      throw new BadRequestException(EMAIL_ALREADY_EXISTS);
    }

    return 'ok';
  }

  async createCustomer(User: UserDto) {
    try {
      User.role = Role.CUSTOMER;

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

      const result = await this.userRepository.save({ ...User, code: generateId });
      if (result) {
        const data = {
          email: result?.email,
          first_name: result?.name,
          last_name: 'BV',
        };
        await this.addMemberToAudience(data);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async update(User: Omit<UserDto, 'username'>, code: string) {
    try {
      const result = await this.userRepository.findOne({
        where: { code: code },
      });

      if (!result) {
        throw new NotFoundException();
      }

      return await this.userRepository.save({ ...result, ...User });
    } catch (error) {
      console.log(error);
    }
  }

  async exchangeCodeForAccessToken(code) {
    const clientId = process.env.appIdZalo;
    const clientSecret = process.env.secretKeyZalo;
    const tokenEndpoint = 'https://oauth.zaloapp.com/v4/oa/access_token';

    // Encode the body parameters in application/x-www-form-urlencoded format
    const requestBody = querystring.stringify({
      app_id: clientId,
      grant_type: 'authorization_code',
      code: code,
    });
    const response = await axios.post(tokenEndpoint, requestBody, {
      headers: {
        secret_key: clientSecret,
      },
    });
    // Extract the access token from the response

    this.setTokens(response.data.refresh_token, response.data.access_token);
    return response.data.access_token;
  }

  async refreshAccessToken(refresh_Token: any) {
    const clientId = process.env.appIdZalo;
    const clientSecret = process.env.secretKeyZalo;
    try {
      const tokenEndpoint = 'https://oauth.zaloapp.com/v4/oa/access_token';

      // Encode the body parameters in application/x-www-form-urlencoded format
      const requestBody = querystring.stringify({
        app_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refresh_Token,
      });

      const response = await axios.post(tokenEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          secret_key: clientSecret,
        },
      });
      // Extract the access token from the response

      this.setTokens(response.data.refresh_token, response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
  async sendMessage(userid, messagecontent) {
    const { app_accessToken } = this.getTokens();
    try {
      const apiEndpoint = 'https://openapi.zalo.me/v3.0/oa/message/cs';
      // Encode the body parameters in application/x-www-form-urlencoded format
      const requestBody = {
        recipient: {
          user_id: userid, // Replace with the Zalo user ID you want to send the message to
        },
        message: {
          text: messagecontent,
        },
      };
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          access_token: app_accessToken,
        },
      });
      if (response.data && response.data.error !== 0) {
        console.log(response.data.error); // log lỗi để xác định theo số lỗi (err number)
        return 'fail';
      } else {
        return 'success';
      }
    } catch (error) {
      console.log(error);
      return 'false';
    }
  }
  async sendTransactionmessage(userid, messagecontent) {
    try {
      const { app_accessToken } = this.getTokens();
      const apiEndpoint = 'https://openapi.zalo.me/v3.0/oa/message/transaction';
      // Encode the body parameters in application/x-www-form-urlencoded format
      const requestBody = {
        recipient: {
          user_id: userid, // Replace with the Zalo user ID you want to send the message to
        },
        message: {
          text: messagecontent,
        },
      };
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          access_token: app_accessToken,
        },
      });
      if (response.data && response.data.error !== 0) {
        console.log(response.data.error); // log lỗi để xác định theo số lỗi (err number)
        return 'fail';
      } else {
        return 'success';
      }
    } catch (error) {
      console.log(error);
      return 'false';
    }
  }
  async sendZNSMessage(template_id, phone_number, message_data) {
    const apiUrl = 'https://business.openapi.zalo.me/message/template';
    const { app_accessToken } = this.getTokens();
    try {
      const requestBody = {
        phone: phone_number,
        template_id: template_id,
        template_data: message_data,
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          access_token: app_accessToken,
        },
      });

      // message return 'Success or
      if (response.data && response.data.error !== 0) {
        console.log(response.data.error); // log lỗi để xác định theo số lỗi (err number)
        return 'fail';
      } else {
        return 'success';
      }
    } catch (error) {
      console.error('Error sending ZNS Message:', error.response ? error.response.data : error.message);
      return 'error';
    }
  }
  async sendMsgzalo(body: ZaloDto) {
    const { app_accessToken, refreshToken } = this.getTokens();
    const { user_id, customer_id, text_message, trans_message, phone_number, customer_name, company_name, program_name, program_detail, program_condition } = body;

    const template_id = '306354'; //template id tren zns gui tinkhyyen mai cua 1tourCRM

    const zns_message_data = {
      customer_name,
      company_name,
      program_name,
      program_detail,
      program_condition,
    };

    // refresh lai access token trong truong hop error
    if (app_accessToken == 'undefined' || app_accessToken == '') {
      await this.refreshAccessToken(refreshToken);
    }

    const result = await this.sendMessage(user_id, text_message);
    const result_trans = await this.sendTransactionmessage(customer_id, trans_message);
    const result_sendzns = await this.sendZNSMessage(template_id, phone_number, zns_message_data);
  }

  async createAudience(audienceData: any) {
    try {
      const response = await axios.post(`${this.baseUrlZalo}/lists`, audienceData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `apikey ${process.env.apiKeyMail}`,
        },
      });
      const audienceId = response.data.id;
      return audienceId;
    } catch (error) {
      console.error('Error creating audience:', error.response ? error.response.data : error.message);
      return null;
    }
  }

  async addMemberToAudience(data: AddMemberToAudienceDto) {
    const audienceMemberData = {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.first_name,
        LNAME: data.last_name,
      },
    };
    try {
      const response = await axios.post(`${this.baseUrlZalo}/lists/${process.env.audience_id}/members`, audienceMemberData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `apikey ${process.env.apiKeyMail}`,
        },
      });

      const memberId = response.data.id;

      return memberId;
    } catch (error) {
      console.error('Error adding member:', error.response ? error.response.data : error.message);
      return null;
    }
  }

  async sendMsgmail(data: MailDto) {
    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: process.env.audience_id,
      },
      settings: {
        subject_line: data.name,
        title: data.title,
        from_name: process.env.company_name,
        reply_to: process.env.MAIL_NOREPLY,
        template_id: process.env.template_id,
      },
      content: {
        html: data.text_message,
      },
      schedule: {
        send_time: data.send_time,
        timezone: process.env.timezone,
      },
    };
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `apikey ${process.env.apiKeyMail}`,
      };

      await axios
        .post(`${this.baseUrlZalo}/campaigns`, campaignData, { headers })
        .then(async (response) => {
          const campaignId = response.data.id;
          // Send the campaign
          await axios.post(`${this.baseUrlZalo}/campaigns/${campaignId}/actions/send`, null, { headers });
          return campaignId;
        })
        .then((response) => {
          console.log('Email campaign sent successfully.');
          // return 'success';
        });
    } catch (error) {
      console.error('Error sending mail :', error.response ? error.response.data : error.message);
      return null;
    }
  }

  async getDetail(code: string) {
    return await this.findOne({ where: { code: code }, relations: { authorities: true } });
  }
  async getProfile(user: User) {
    const data = await this.findOne({ where: { code: user.code }, relations: { authorities: true } });
    delete data.password;
    return data;
  }

  async getProfileUser(user: User) {
    const data = await this.findOne({ where: { code: user.code }, relations: { authorities: true } });
    return data;
  }

  async find(body: UserFilterDto) {
    try {
      return await this.commonService.getTotalAndList({
        tableName: 'user',
        body: {
          ...body,
          filter: {
            username: body.filter.username && Like(`%${body.filter.username}%`),
            name: body.filter.name && Like(`%${body.filter.name}%`),
            phone: body.filter.phone && Like(`%${body.filter.phone}%`),
            address: body.filter.address && Like(`%${body.filter.address}%`),
            role: body.filter.role,
            status: body.filter.status,
          },
        },
        relations: { authorities: true },
        select: ['id', 'code', 'name', 'phone', 'role', 'status', 'username', 'created_at', 'updated_at', 'email', 'address'],
      });
    } catch (error) {
      console.log(error);
    }
  }
  async findAll(query: any) {
    return await this.userRepository.find({
      where: {
        role: Not(Role.CUSTOMER),
        status: query?.status || undefined,
      },
      select: { id: true, code: true, username: true, name: true, role: true },
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllCustomer(query: UserQueryCustomerDto) {
    return await this.userRepository.find({
      select: { code: true, username: true, name: true, role: true, phone: true },
      where: { role: Role.CUSTOMER, status: query?.status || undefined },

      order: {
        id: 'DESC',
      },
    });
  }
  async findAllStaff(query: UserQueryDto) {
    return await this.userRepository.find({
      select: { code: true, username: true, name: true, role: true, phone: true },
      where: { role: Role.STAFF, status: query?.status || undefined },

      order: {
        id: 'DESC',
      },
    });
  }
  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async updateProfile(userDto: UserProfileDto, user: User) {
    const payload = {
      ...user,
      name: userDto.name,
      phone: userDto.phone,
      gender: userDto.gender,
      email: userDto.email,
      ...(userDto.password ? { password: userDto.password } : {}),
      ...(userDto.avatar ? { avatar: userDto.avatar } : {}),
    };

    return await this.save(payload);
  }

  async delete(query: any) {
    try {
      await this.userRepository.delete({
        code: query?.code,
      });
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }
}
