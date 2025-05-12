import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private logger = new Logger('PrismaException');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception:
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientRustPanicError
      | PrismaClientInitializationError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message ? exception.message : typeof exception;

    const responseBody = {
      code: httpStatus,
      message: message,
      data: {
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        type: typeof exception,
      },
    };

    this.logger.error(exception.stack);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
