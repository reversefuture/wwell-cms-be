import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfig } from 'config';
import { authResponseMessage } from 'constants/response-messages.constant';
import { Request } from 'express';

const { UNAUTHORIZED } = authResponseMessage;
const { API_KEY } = AppConfig;

/**
 * Check if API key is present for general public api
 */
@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  private logger = new Logger(ApiKeyAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const keyOrKeysFromRequest = this.extractApiKeyFromRequestHeader(request);
    const keyFromRequest = Array.isArray(keyOrKeysFromRequest)
      ? keyOrKeysFromRequest[0]
      : keyOrKeysFromRequest;

    // check if the apiKey is provided
    if (keyFromRequest.length === 0) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    // check if the api key is matching
    if (API_KEY !== keyFromRequest) {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return true;
  }

  extractApiKeyFromRequestHeader(request: Request) {
    return request?.headers?.['x-api-key'] || '';
  }
}
