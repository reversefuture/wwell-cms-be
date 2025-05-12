import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CLEAR_CACHE_KEYS_METADATA } from '../decorator/clear-cache-keys.decorator';
import { CACHE_KEY_METADATA } from '@nestjs/cache-manager';

@Injectable()
export class MemoryCacheService {
  private cache: Map<string, any> = new Map();

  clearCacheByKey(key: string): void {
    this.cache.delete(key);
  }
}

@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly cacheService: MemoryCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customKeys: string[] = this.reflector.get(
      CLEAR_CACHE_KEYS_METADATA,
      context.getHandler(),
    );
    const defaultKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (defaultKey) customKeys.push(defaultKey);
    customKeys.forEach((key) => {
      this.cacheService.clearCacheByKey(key);
    });
    return next.handle();
  }
}