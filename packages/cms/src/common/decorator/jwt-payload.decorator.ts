import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.payload;
    return data ? payload?.[data] : payload;
  },
);
