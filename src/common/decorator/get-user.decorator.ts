import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  <T = unknown>(data: unknown, ctx: ExecutionContext): T => {
    const req = ctx.switchToHttp().getRequest<{ user: T }>();
    return req.user;
  },
);
