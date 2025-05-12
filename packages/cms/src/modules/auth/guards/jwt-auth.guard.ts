import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isBefore } from 'date-fns';
import { Request as RequestType } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtAuthService } from '../jwt-auth.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { UserService } from 'modules/user/user.service';
import { IS_PUBLIC_KEY } from 'common/decorator/public.decorator';
import { authResponseMessage } from 'constants/response-messages.constant';
import { AppConfig } from 'config';

/*
* Check if JWT is valid
* If we add more than one guard to a route, e.g. @UseGuards([AuthGuard1. AuthGuard2]) in NestJS, they all need to pass (AND logic) for route to be able to activate. Therefore, the OR logic will be handled in this auth guard.
*/
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get metadata from the handler and class targes and check if the endpoint decorated as isPublic
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // extract JWT from the request
    const request = context.switchToHttp().getRequest();
    const tokens = [
      this.extractJWTFromQueryParams(request),
      this.extractJWTFromXAccessHeader(request),
      this.extractJWTFromAuthHeader(request),
      this.extractJWTFromCookie(request),
    ]
      .filter(Boolean)
      .filter((x) => x.length != 0);
    if (tokens.length == 0) {
      throw new UnauthorizedException(authResponseMessage.UNAUTHORIZED);
    }

    try {
      // verify the jwt signature
      const payload = <JwtPayload>(
        jwt.verify(tokens[0], AppConfig.JWT_SECRET)
      );
      console.log('[JwtAuthGuard] - canActivate - payload: ', payload);

      if (!payload) {
        throw new UnauthorizedException(authResponseMessage.UNAUTHORIZED);
      }

      // check if the JWT is blacklisted
      const { sub, jti, exp } = payload;
      const blacklisted = await this.jwtAuthService.isJTIBlacklisted(jti);
      if (blacklisted) {
        throw new UnauthorizedException(authResponseMessage.UNAUTHORIZED);
      }

      // check if the JWT is expired
      const expiredAt = parseInt(String(exp));
      const now = Math.floor(Date.now() / 1000); // in seconds
      if (isBefore(expiredAt, now)) {
        throw new UnauthorizedException(authResponseMessage.JWT_EXPIRED);
      }

      // resolve user from the payload
      const user = await this.userService.getById(sub);
      if (!user) {
        console.log('user not found');
        throw new UnauthorizedException(authResponseMessage.UNAUTHORIZED);
      }
      request.user = user;
      request.payload = payload;
      return true;
    } catch (error: any) {
      console.log(error.stack)
      throw new UnauthorizedException(
        authResponseMessage.JWT_INVALID_SIGNATURE,
      );
    }
  }

  decodeAllTokens(tokens: string[]) {
    return tokens
      .map((token) => {
        this.jwtService.decode(token);
      })
      .filter((payload) => payload !== null && payload !== undefined);
  }

  extractJWTFromQueryParams(request: RequestType):string {
    return request?.query?.['token'] as string;
  }

  extractJWTFromXAccessHeader(request: RequestType) {
    return request?.headers?.['x-access-token'];
  }

  extractJWTFromAuthHeader(request: RequestType) {
    const authHeader = request.headers.authorization || '';
    return authHeader.replace('Bearer ', '');
  }

  extractJWTFromCookie(request: RequestType) {
    return request?.cookies?.[AppConfig.TOKEN_KEY];
  }
}
