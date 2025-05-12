import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  defaultPaginationOption,
  PaginationOption,
} from '../pagination/pagination.query';

export const Pagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pagination = new PaginationOption();
    pagination.offset = !!request.query.offset
      ? +request.query.offset
      : defaultPaginationOption.offset;
    pagination.limit = !!request.query.limit
      ? +request.query.limit
      : defaultPaginationOption.limit;
    pagination.sortBy = !!request.query.sortBy
      ? request.query.sortBy.replace(' ', '+')
      : defaultPaginationOption.sortBy;
    pagination.orderBy = !!request.query.orderBy
      ? request.query.orderBy
      : defaultPaginationOption.orderBy;
    return pagination;
  },
);
