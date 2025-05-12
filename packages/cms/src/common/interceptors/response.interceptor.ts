import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiResponseMessage } from 'modules/shared/response-messages.constant';

export type Response<T> = { data: T };

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method } = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const message = apiResponseMessage[`${method}_SUCCESS`];

    return next.handle().pipe(
      map((response) => ({
        code: statusCode,
        message: !!response.message ? response.message : message,
        data: response.data,
        ...response,
      })),
    );
  }
}
