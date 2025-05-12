import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateOTPDto, LoginDto, RegisterDto, VerifyEmailOTPDto } from './dto';
import { JwtAuthService } from './jwt-auth.service';
import { OTPAuthenticationService } from './otp-authentication.service';
import { AuthenticationService } from './authentication.service';
import { Public } from 'common/decorator/public.decorator';
import { apiResponseMessage, authResponseMessage } from 'constants/response-messages.constant';
import { JwtPayload } from 'common/decorator/jwt-payload.decorator';
import { isBefore } from 'date-fns';
import { EmailsService } from '../emails/emails.service';
import { RequestWithUser } from 'types/requestTypes';
import { usersResponseMessage } from '../shared/response-messages.constant';
import { UserService } from 'modules/user/user.service';

@ApiTags('authentication')
@Controller({
  version: '1',
  path: 'authentication',
})
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly emailService: EmailsService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly otpAuthService: OTPAuthenticationService,
    private readonly usersService: UserService,
  ) {}

  /**
   * User registration
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: authResponseMessage.GENERATE_OTP_SUCCESS,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(registerDto, res);
  }

  /**
   * User login
   */
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: authResponseMessage.LOGIN_SUCCESS,
  })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      user: { id: userId },
    } = req;
    //first login
    if (req.user.lastLoginTime == null ) {
      // TODO: dispatch rewards or tokens
    }
    const user = await this.usersService.getById(userId);
    return await this.authService.handleLogin(user, res);
  }

  /**
   * User logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('jwt')
  @ApiOkResponse({
    description: authResponseMessage.LOGOUT_SUCCESS,
  })
  @ApiUnauthorizedResponse({
    description: authResponseMessage.UNAUTHORIZED,
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @JwtPayload('jti') jti?: string,
    @JwtPayload('exp') exp?: number,
  ) {
    // invalidate the JWT by blacklisting its jti
    if (jti && exp) await this.jwtAuthService.addJTIToBlacklist(jti, exp);

    // clear the JWT
    await this.jwtAuthService.unsetJWT(res);
    return {
      code: HttpStatus.OK,
      message: authResponseMessage.LOGOUT_SUCCESS,
    };
  }

  /**
   * Get current user
   */
  @Get('current')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('jwt')
  @ApiOkResponse({
    description: apiResponseMessage.GET_SUCCESS,
  })
  @ApiUnauthorizedResponse({
    description: authResponseMessage.UNAUTHORIZED,
  })
  async currentUser(
    @Req() { user }: RequestWithUser
  ) {
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.GET_SUCCESS,
      data: user,
    };
  }

  /**
   * Generate an OTP for email verification
   */
  @Public()
  @Post('otp/new')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: authResponseMessage.GENERATE_OTP_SUCCESS,
  })
  async generateOtp(@Body() { email, mobile }: CreateOTPDto) {
    if(!email || !mobile){
      throw new BadRequestException(authResponseMessage.OTP_MISSING_PARAMS);
    }
    // check if the user exists
    let user;
    if(email){
      user = await this.usersService.getByEmail(email);
    }else if(mobile){
      user = await this.usersService.getByMobile(mobile);
    }
    if (!user) {
      // In order to aviod hackers to abuse this design to compile a list of valid users through automated brute force guessing attempts. This api should return the same response whether or not the supplied username is associated with a valid account. This message must be returned to the user before any server-side password reset logic is performed to prevent users from guessing valid usernames based on the server's response time. Please refer to 3.2.2.1 in `Synopsys - AIA - AIA_Workwell_iOS_Mobile_Application_Final_Report`
      return {
        code: HttpStatus.OK,
        message: authResponseMessage.GENERATE_OTP_SUCCESS,
      };
    }
    // generate new otp
    const { token, expiryTime } = await this.otpAuthService.generateOTPToken(
      user,
    );
    if(email){
      // send email with the otp template
      await this.emailService.sendOTPMail(
        user.preferredLanguage,
        user.email,
        token,
        expiryTime.toFixed(0),
      );
    }else if(mobile){
      // TODO: send sms 
    }
    return {
      code: HttpStatus.OK,
      message: authResponseMessage.GENERATE_OTP_SUCCESS,
    };
  }

  /**
   * Verify an OTP
   */
  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: authResponseMessage.OTP_VALID,
  })
  @ApiConflictResponse({
    description: [
      authResponseMessage.OTP_EXPIRED,
      authResponseMessage.OTP_INVALID,
    ].join(' '),
  })
  @ApiNotFoundResponse({
    description: usersResponseMessage.NOT_FOUND,
  })
  async verifyOtp(@Body() { email, otpCode }: VerifyEmailOTPDto) {
    // check if the user exists
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: usersResponseMessage.NOT_FOUND,
      };
    }
    // check if the OTP is valid
    const isCodeValid = await this.otpAuthService.isOTPCodeValid(
      otpCode,
      email,
    );
    if (!isCodeValid) {
      return {
        code: HttpStatus.CONFLICT,
        message: authResponseMessage.OTP_INVALID,
      };
    }
    // check if the OTP is alive
    const counter = parseInt(user.otpCounter);
    if (isBefore(counter, Date.now())) {
      return {
        code: HttpStatus.CONFLICT,
        message: authResponseMessage.OTP_EXPIRED,
      };
    }
    return {
      code: HttpStatus.OK,
      message: authResponseMessage.OTP_VALID,
    };
  }
}
