import { SetMetadata } from '@nestjs/common';

export const CLEAR_CACHE_KEYS_METADATA = 'CLEAR_CACHE_KEYS_METADATA';

export const ClearCacheKeys = (...cacheKeys: string[]) =>
  SetMetadata(CLEAR_CACHE_KEYS_METADATA, cacheKeys);
