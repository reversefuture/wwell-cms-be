import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CacheByUserInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    // check if the custom cache key exists
    const { user, _parsedUrl } = context.switchToHttp().getRequest();
    const { pathname, query } = _parsedUrl;

    // handle custom cache key
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    let keyStr = cacheKey ? cacheKey : pathname;
    console.log(pathname);

    // append userId
    if (user.id) {
      keyStr = `${keyStr}-userId=${user.id}`;
    }

    // append pathname
    if (!!pathname) {
      keyStr = `${keyStr}-pathname=${pathname}`;
    }

    // append query params
    if (!!query) {
      keyStr = `${keyStr}-query=${query}`;
    }

    console.log(keyStr);
    return keyStr;
  }
}
