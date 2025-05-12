import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join, sep } from 'path';
import {
  BLACKLIST_TEMPLATE,
  BLACKLIST_EMAIL_SUBJECT,
  OTP_EMAIL_SUBJECT,
  OTP_EMAIL_TEMPLATE,
} from './constant';
import { AppConfig } from 'config';
import { LanguageType } from '../../../prisma/client';

@Injectable()
export class EmailsService {
  constructor(private mailerService: MailerService) {}

  async sendOTPMail(
    lang: LanguageType,
    userEmail: string,
    otpToken: string,
    expiryTime: string,
  ) {
    try {
      await this.mailerService.sendMail({
        template: this.getOTPEmailTemplateByLanguage(lang),
        to: userEmail,
        subject: this.getOTPEmailSubjectByLanguage(lang),
        context: {
          appName: AppConfig.title,
          otpToken,
          expiryTime,
        },
        attachments: [
          {
            filename: 'wwa-logo.png',
            path: join(
              __dirname,
              sep,
              '..',
              sep,
              '..',
              '/email-templates/images/wwa-logo.png',
            ),
            cid: 'wwa-logo', // "cid:wwa-logo" in the html img src
          },
        ],
      });
    } catch (error) {
      throw new BadRequestException(`SES Service ${error}`);
    }
  }

  async sendBLackListEmail(
    lang: LanguageType,
    userEmail: string,
    username: string,
  ) {
    try {
      // create iCalendar instance then add event
      await this.mailerService.sendMail({
        template: this.getBlacklistTemplateByLanguage(lang),
        to: userEmail,
        subject: this.getBlackListSubjectByLanguage(lang),
        context: {
          username,
        },
      });
    } catch (error) {
      throw new BadRequestException(`SES Service ${error}`);
    }
  }

  getOTPEmailTemplateByLanguage(lang: LanguageType) {
    return lang === LanguageType.zh
      ? OTP_EMAIL_TEMPLATE.zh
      : OTP_EMAIL_TEMPLATE.en;
  }

  getOTPEmailSubjectByLanguage(lang: LanguageType) {
    return lang === LanguageType.zh
      ? OTP_EMAIL_SUBJECT.zh
      : OTP_EMAIL_SUBJECT.en;
  }

  getBlackListSubjectByLanguage(lang: LanguageType) {
    return lang === LanguageType.zh
      ? BLACKLIST_EMAIL_SUBJECT.zh
      : BLACKLIST_EMAIL_SUBJECT.en;
  }

  getBlacklistTemplateByLanguage(lang: LanguageType) {
    return lang === LanguageType.zh
      ? BLACKLIST_TEMPLATE.zh
      : BLACKLIST_TEMPLATE.en;
  }
}
