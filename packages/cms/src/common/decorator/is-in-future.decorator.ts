import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate, MinDate } from 'class-validator';

export function IsInFuture() {
  return applyDecorators(
    IsDate(),
    MinDate(new Date()),
    Transform(({ value }) => value && new Date(value)),
  );
}
