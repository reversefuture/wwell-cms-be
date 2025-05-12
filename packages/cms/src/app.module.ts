import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { AppLoggerMiddleware } from './common/middlewares/logger.middleware';
import { PrismaModule } from './db/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtAuthGuard, RolesGuard } from 'modules/auth/guards';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'modules/auth/jwt-auth.service';
import { AuthenticationModule } from 'modules/auth/authentication.module';
import { join } from 'path';
import { sesMailConfig } from './config/ses-email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [
    ConfigModule.forRoot(), ScheduleModule.forRoot(),
    CacheModule.register({// 内存缓存
      ttl: 5 * 60 * 1000, // 缓存过期时间（毫秒），例如 5 分钟
      max: 100, // 最大缓存数量
      isGlobal: true, // 全局缓存模块
    }),
    MailerModule.forRoot({
      transport: {
        host: sesMailConfig.host,
        port: sesMailConfig.port,
        secure: true,
        auth: {
          user: sesMailConfig.username,
          pass: sesMailConfig.password,
        },
        tls: {
          rejectUnauthorized: false, // do not fail on invalid certs
        },
      },
      defaults: {
        from: sesMailConfig.email,
      },
      preview: false,
      template: {
        dir: join(__dirname, '/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    // ConfigCenterService, //配置中心
    AppService,
    {
      provide: APP_GUARD, // 注册为全局守卫
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtAuthGuard,
    JwtService,
    JwtAuthService,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
