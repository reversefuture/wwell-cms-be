import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { OTPAuthenticationService } from './otp-authentication.service';
import { authResponseMessage } from 'constants/response-messages.constant';
import { BaseService } from 'common/base/base.service';
import { PrismaService } from 'db/prisma.service';
import { UserService } from 'modules/user/user.service';
import { JwtAuthService } from './jwt-auth.service';
import { AppConfig } from 'config';
import { LoginDto, RegisterDto } from './dto';
import { AuthenticatedUser } from 'types/requestTypes';
import { EmailsService } from '../emails/emails.service';
import { User } from '@prisma/client';

const { REGISTERD_USER } = authResponseMessage;

@Injectable()
export class AuthenticationService extends BaseService<User> {
  private logger = new Logger(AuthenticationService.name);
  constructor(
    prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UserService,
    private readonly emailService: EmailsService,
    private readonly otpAuthService: OTPAuthenticationService,
  ) {
    super(prismaService.user);
  }

  async getAuthenticatedUser(email: string, planTextCredential: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyCredential(planTextCredential, user.credential);
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        authResponseMessage.AUTHENTICATION_FAILED,
      );
    }
  }

  async verifyCredential(planTextCredential: string, hashedCredential: string) {
    const isCredentialMatching = await bcrypt.compare(
      planTextCredential,
      hashedCredential,
    );
    if (!isCredentialMatching) {
      throw new ConflictException(authResponseMessage.CREDENTIAL_NOT_MATCH);
    }
  }

  async register(registerDto: RegisterDto, res: Response) {
    /*
     Notes: In order to aviod hackers to abuse this design to compile a list of valid users through automated brute force guessing attempts. This api should return the same response whether or not the supplied username is associated with a valid account. This message must be returned to the user before any server-side Credential reset logic is performed to prevent users from guessing valid usernames based on the server's response time. Please refer to 3.2.2.1 in `Synopsys - AIA - AIA_Workwell_iOS_Mobile_Application_Final_Report`
    */
    let user = await this.usersService.getByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException(REGISTERD_USER);
    }

    // create user
    const salt = await bcrypt.genSalt(AppConfig.PASSWORD_SALT_ROUNDS);
    const hashedCredential = await bcrypt.hash(registerDto.credential, salt);
    registerDto.credential = hashedCredential;
    user = await this.usersService.createUser(registerDto);
    // if (registerDto.enableOTP) {
    //   return await this.handleRegistrationForOTPEnabled(user);
    // }
    return await this.handleRegistrationForOTPDisabled(user, res);
  }

  async handleRegistrationForOTPEnabled(user: User) {
    // generate OTP code
    const { email, preferredLanguage } = user;
    const { token, expiryTime } = await this.otpAuthService.generateOTPToken(
      user,
    );

    // send the OTP to the user email
    await this.emailService.sendOTPMail(
      preferredLanguage,
      email,
      token,
      expiryTime.toFixed(0),
    );
    return {
      code: HttpStatus.OK,
      data: { enableOTP: true },
      message: authResponseMessage.GENERATE_OTP_SUCCESS,
    };
  }

  async handleRegistrationForOTPDisabled(user: User, res: Response) {
    // sign jwt with userId & set it to the response headers
    const { name, value, options } =
      await this.jwtAuthService.getJWTWithCookieOptions(user.id);
    await this.jwtAuthService.setJWTInCookie(name, value, options, res);
    await this.jwtAuthService.setJWTInAuthHeaders(value, res);

    const { token, code, message, data } = await this.handleLogin(user, res);

    return {
      token,
      code,
      message,
      data: { enableOTP: false, ...data },
    };
  }

  async handleLogin(user: AuthenticatedUser, res: Response) {
    // sign jwt with userId & set it to the response headers
    const { name, value, options } =
      await this.jwtAuthService.getJWTWithCookieOptions(user.id);
    await this.jwtAuthService.setJWTInCookie(name, value, options, res);
    await this.jwtAuthService.setJWTInAuthHeaders(value, res);

    return {
      token: value,
      code: HttpStatus.OK,
      message: authResponseMessage.LOGIN_SUCCESS,
      data: user,
    };
  }
}
