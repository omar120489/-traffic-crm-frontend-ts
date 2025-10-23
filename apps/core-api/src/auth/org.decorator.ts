import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Org = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.orgId as string;
  }
);

