import {
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { orderByEnum } from '../types/fixedTypes';
import { IsSorting } from '../validator/sorting.validator';

export const defaultPageOffset = 0;
export const defaultPageLimit = 20;
export class PaginationOption {
  @IsNumber()
  @IsPositive()
  @Max(20)
  limit: number;

  @IsNumber()
  @Min(0)
  offset: number;

  @IsSorting()
  sortBy: string;

  @IsEnum(orderByEnum)
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  orderBy: string;

  getSortingQuery() {
    if (!!this.sortBy) {
      const sortArray = this.sortBy.split(',');
      return sortArray.reduce((prev, curr) => {
        prev[curr.substring(1)] = curr.substring(0, 1) === '+' ? 1 : -1;
        return prev;
      }, {});
    } else {
      return { createdAt: -1 };
    }
  }
}

export const defaultPaginationOption = new PaginationOption();
defaultPaginationOption.offset = defaultPageOffset;
defaultPaginationOption.limit = defaultPageLimit;
defaultPaginationOption.sortBy = 'createdAt';
defaultPaginationOption.orderBy = 'desc';
