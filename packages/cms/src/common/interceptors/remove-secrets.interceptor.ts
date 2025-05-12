import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveSecretsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((value) =>
          deleteProps(value, ['otpCounter', 'otpSecret', 'password']),
        ),
      );
  }
}

function deleteProps(value: unknown, keys): unknown {
  if (value instanceof Date) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(function (x) {
      return deleteProps(x, keys);
    });
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !keys.includes(k))
        .map(([k, v]) => [k, deleteProps(v, keys)]),
    );
  }
  return value;
}
