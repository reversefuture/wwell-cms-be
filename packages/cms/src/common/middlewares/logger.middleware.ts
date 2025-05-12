import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode, statusMessage } = response;

      this.logger.log(
        `[${method}] ${url} ${statusCode} ${
          statusMessage || ''
        } - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
