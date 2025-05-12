import { Injectable } from '@nestjs/common';
import { authenticator, hotp } from 'otplib';
import { addSeconds } from 'date-fns';
import { PrismaService } from 'db/prisma.service';
import { BaseService } from 'common/base/base.service';
import { UserService } from 'modules/user/user.service';
import { AppConfig } from 'config';
import { User } from '../../../prisma/client';

@Injectable()
export class OTPAuthenticationService extends BaseService<User> {
  constructor(
    prismaService: PrismaService,
    private readonly userService: UserService,
  ) {
    super(prismaService.user);
 
    // OTP configurations
    authenticator.options = {
      digits: AppConfig.otpDigits,
      step: AppConfig.otpTimestep,
    };
    hotp.options = {
      digits: AppConfig.otpDigits,
      step: AppConfig.otpTimestep,
    };
  }

  async generateOTPToken(user: User) {
    const secret = user.otpSecret || authenticator.generateSecret();
    const expiryTime = AppConfig.otpTimestep;
    const expiredAt = addSeconds(new Date(), expiryTime);
    const counter = Number(expiredAt);
    const token = hotp.generate(secret, counter);
    if (!user.otpSecret) {
      await this.userService.setOTPSecret(secret, counter.toString(), user.id);
    } else {
      await this.userService.setOTPCounter(counter.toString(), user.id);
    }
    return { token, expiryTime };
  }

  async invalidateOTPToken(user: User) {
    const counter = Date.now(); // expires immediately
    await this.userService.setOTPCounter(counter.toString(), user.id);
  }

  async isOTPCodeValid(otpCode: string, email: string) {
    const user = await this.userService.getByEmail(email);
    const counter = parseInt(user.otpCounter);
    return hotp.check(otpCode, user.otpSecret, counter);
  }
}
