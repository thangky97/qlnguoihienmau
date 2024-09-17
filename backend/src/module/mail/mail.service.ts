import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, options, titleMail: any = 'No Reply') {
    await this.mailerService.sendMail({
      from: `${titleMail} <${process.env.MAIL_NOREPLY}>`,
      to: email,
      ...options,
    });
  }
  async sendMailOrder(emails: string[], options) {
    await this.mailerService.sendMail({
      from: `No Reply <${process.env.MAIL_NOREPLY}>`,
      to: emails.join(', '),
      ...options,
    });
  }
}
