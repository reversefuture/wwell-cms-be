import { APIResponse } from '@gcswwell/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTPException');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message ? exception.message : typeof exception;

    // extract error message from ValidationPipe
    if (
      exception instanceof BadRequestException &&
      Array.isArray(exception['response']['message'])
    ) {
      message = exception['response']['message'].join('. ') + '.';
    }

    this.logger.error(
      `[METHOD: [${httpAdapter.getRequestMethod(
        ctx.getRequest(),
      )}] - URL: [${httpAdapter.getRequestUrl(
        ctx.getRequest(),
      )}] - STATUS: [${httpStatus}] - Error Message [${message}]`,
    );

    const apiResponse: APIResponse = {
      code: httpStatus,
      message: message,
      data: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
    httpAdapter.reply(ctx.getResponse(), apiResponse, httpStatus);
  }
}
