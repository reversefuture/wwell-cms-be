import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ApiKeyAuthGuard, JwtAuthGuard } from './guards';
import { JwtAuthService } from './jwt-auth.service';
import { UserModule } from 'modules/user/user.module';
import { AppConfig } from 'config';
import { LocalStrategy } from './strategies';
import { OTPAuthenticationService } from './otp-authentication.service';
import { EmailsService } from '../emails/emails.service';

@Module({
  imports: [
    forwardRef(() => UserModule), //延迟对 UserModule 的引用防止循环依赖
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: AppConfig.JWT_SECRET,
        signOptions: {
          expiresIn: `${AppConfig.JWT_EXPIRATION_TIME}s`,
        },
        global: true,
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    ApiKeyAuthGuard,
    AuthenticationService,
    LocalStrategy,
    OTPAuthenticationService,
    EmailsService,
    JwtAuthService,
    JwtAuthGuard,
  ],
  exports: [
    ApiKeyAuthGuard,
    AuthenticationService,
    OTPAuthenticationService,
    JwtAuthService,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthenticationModule {}
