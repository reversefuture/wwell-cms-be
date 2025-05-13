import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser'; // Correct import statement
import 'dotenv/config';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
} from './common/error-handling';
import { AppConfig, isProductionEnv, serverConfig } from './config';
import { RemoveSecretsInterceptor } from './common/interceptors';
import { JwtAuthGuard } from 'modules/auth/guards';
// import { runInCluster } from './utils/nodejs-cluster/runInCluster';

const pipeOptions = {
  transform: true,
  whitelist: true, // strips properties not defined in the dto
  enableDebugMessages: !isProductionEnv(),
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  app.enableCors(); // enable cross-origin resource sharing
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter({ httpAdapter } as HttpAdapterHost)); // 全局过滤,用于捕获和处理应用程序中抛出的异常,也可以通过APP_FILTER注册到app.module
  app.useGlobalFilters(new PrismaExceptionFilter({ httpAdapter } as HttpAdapterHost));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // 全局拦截器,在请求处理的前后执行额外的逻辑，用于修改请求或响应, 也可以通过APP_INTERCEPTOR注册到app.module
  app.useGlobalInterceptors(new RemoveSecretsInterceptor());
  app.useGlobalPipes(new ValidationPipe(pipeOptions)); // 全局管道,用于验证和转换请求数据,也可以通过全局管道注册到app.module
  // app.useGlobalGuards(JwtAuthGuard); // 全局守卫,用于控制请求是否允许进入路由处理程序,已经在app.module注册

  if (!isProductionEnv()) {
    // configure Swagger UI
    const options = new DocumentBuilder() // 配置 Swagger 文档的生成选项。
      .addApiKey({
        name: AppConfig.API_KEY, //API 密钥的安全配置
        type: 'apiKey',
      })
      .addSecurity('jwt', {
        name: 'x-access-token',
        in: 'header',
        type: 'apiKey',
      })
      .setTitle(AppConfig.title + ' APIs')
      .setVersion(AppConfig.version)
      .build();

    // serves the Swagger documentation at http://localhost:3100/api
    // and a Swagger JSON file availabe at http://localhost:3100/api-json
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(serverConfig.port);
}

// runInCluster(bootstrap);
bootstrap();
