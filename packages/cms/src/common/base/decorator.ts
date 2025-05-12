import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { FilterTypeEnum, orderByEnum } from '../types/fixedTypes';
import { searchTerms } from '../types/searchTerms';

export const FilterBodyOptions = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const response = {
      filter: null,
      filterType: FilterTypeEnum.OR,
      sortBy: 'updatedAt',
      orderBy: orderByEnum.desc,
      limit: 20,
      offset: 0,
      select: null,
      include: null,
    };
    if (request.body) {
      // Body exists
      if (request.body.filter && request.body.filterType) {
        response.filter = request.body.filter;
      }
      if (
        request.body.filterType &&
        request.body.filterType.toUpperCase() in FilterTypeEnum
      ) {
        response.filterType = request.body.filterType.toUpperCase();
      }
      if (
        request.body.sortBy &&
        request.body.orderBy &&
        request.body.orderBy in orderByEnum
      ) {
        response.sortBy = request.body.sortBy;
        response.orderBy = request.body.orderBy;
      }
      if (
        // request.body.limit &&
        // +request.body.limit >= 0 &&
        Number.isInteger(request.body.limit)
      ) {
        response.limit = request.body.limit;
      }
      if (
        request.body.offset &&
        +request.body.offset >= 0 &&
        Number.isInteger(request.body.offset)
      ) {
        response.offset = request.body.offset;
      }
      if (request.body.select) {
        const selectedFields = request.body.select.map((x) => {
          return [x.replace(/["']+/g, '').trim(), true];
        });
        response.select = Object.fromEntries(selectedFields); // {include : true} format
      }
      if (request.body.include) {
        const includeFields = request.body.include.map((x) => {
          return [x.replace(/["']+/g, '').trim(), true];
        });
        response.include = Object.fromEntries(includeFields); // {include : true} format
      }
      return response;
    } else {
      return null;
    }
  },
);

// Query Params. key = filter, value = { "<KEY>":"<VALUE>" }
export const FilterOption = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.filter && typeof request.query.filter === 'string') {
      try {
        const filterString = request.query.filter.replace(/[\[\]']+/g, '');
        return filterString.split(',').map((x) => {
          return JSON.parse(x);
        });
      } catch (error: any) {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      return {};
    }
  },
);

export const SearchOption = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const deleteFields = [
      'filter',
      'filterType',
      'sortBy',
      'orderBy',
      'limit',
      'offset',
    ];

    deleteFields.forEach((fields) => {
      delete request.query[fields];
    }); // Deletes all the fields that may be used pagination etc
    if (Object.keys(request.query).length) {
      if (
        searchTerms.hasOwnProperty(request.query[Object.keys(request.query)[0]])
      ) {
        return [
          {
            [Object.keys(request.query)[0]]:
              searchTerms[request.query[Object.keys(request.query)[0]]],
          },
        ];
      } else {
        return {
          [Object.keys(request.query)[0]]: {
            contains: request.query[Object.keys(request.query)[0]],
            mode: 'insensitive', // Default value: default
          },
        };
      }
    }
    return [null];
  },
);

// Query Params. key = sort_by, value = <KEY> / key = order_by, value = <KEY>
export const SortOption = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (
      request.query.sortBy &&
      request.query.orderBy &&
      request.query.orderBy in orderByEnum
    ) {
      try {
        return [
          {
            [request.query.sortBy]: request.query.orderBy,
          },
        ];
      } catch (error: any) {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (request.query.sortBy != request.query.orderBy) {
      throw new HttpException(
        `Error: only sort or order is given`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return [
        {
          updatedAt: orderByEnum.desc,
        },
      ];
    }
  },
);

export const FilterType = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (
      request.query.filterType && // Exists?
      typeof request.query.filterType === 'string' && // check type
      request.body.filterType.toUpperCase() in FilterTypeEnum // check in
    ) {
      if (request.query.filterType.toUpperCase() === FilterTypeEnum.OR) {
        return FilterTypeEnum.OR;
      } else return FilterTypeEnum.AND;
    } else {
      // No filterType defined
      return FilterTypeEnum.OR;
    }
  },
);

// Query Params. key = filter, value = { "<KEY>":"<VALUE>" }
export const SelectedOption = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.select && typeof request.query.select === 'string') {
      try {
        const selectString = request.query.select.replace(/[\[\]']+/g, '');
        const selectOptions = selectString.split(',').map((x) => {
          return [x.replace(/["']+/g, '').trim(), true];
        });
        return Object.fromEntries(selectOptions);
      } catch (error: any) {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      return null;
    }
  },
);

// Query Params. key = filter, value = { "<KEY>":"<VALUE>" }
export const IncludeOption = createParamDecorator(
  <T>(_data: ClassConstructor<T>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.include && typeof request.query.include === 'string') {
      try {
        const includeString = request.query.include.replace(/[\[\]']+/g, '');
        const includeOptions = includeString.split(',').map((x) => {
          return [x.replace(/["']+/g, '').trim(), true]; // Remove "" and trim extra spaces
        });
        // {inlcude : true} format
        return Object.fromEntries(includeOptions);
      } catch (error: any) {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      return null;
    }
  },
);
