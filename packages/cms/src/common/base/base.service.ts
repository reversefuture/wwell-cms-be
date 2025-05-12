import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  defaultPaginationOption,
  PaginationOption,
} from '../pagination/pagination.query';
import { FilterTypeEnum } from '../types/fixedTypes';
import {
  IncludeOption,
  SearchOption,
  SelectedOption,
  SortOption,
} from './decorator';
import { apiResponseMessage } from 'modules/shared/response-messages.constant';

export class BaseService<CreateDto> {
  model: any; // prisma model with the predefined documents
  constructor(model: any) {
    this.model = model;
  }

  /* ------------------------------ CREATE ------------------------------ */

  async create(createDto: CreateDto) {
    try {
      return await this.model.create({
        data: createDto,
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createMultiple(items: Partial<CreateDto>[]) {
    try {
      return await Promise.all(
        items.map(async (data) => {
          return this.model.create({ data });
        }),
      ); // all the created in a array of promise
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /* ------------------------------ READ ------------------------------ */
  // Get with filters
  async bodyFilter(body: any) {
    try {
      const totalCount = await this.model.count({
        where:
          body.filterType !== undefined
            ? { [body.filterType]: body.filter }
            : body.filter,
      });

      // parse orderBy & sortBy
      const sortKey = String(body.sortBy).replace(/['"]+/g, '');
      const sortValue = String(body.orderBy).replace(/['"]+/g, '');
      const orderBy = [];
      if (sortKey.includes('.')) {
        const nestedOrderBy = sortKey.split('.');
        orderBy.push({
          [nestedOrderBy[0]]: {
            [nestedOrderBy[1]]: sortValue,
          },
        });
      } else orderBy.push({ [sortKey]: sortValue });
      const results = await this.model.findMany({
        skip: body.offset,
        take: body.limit,
        where:
          body.filterType !== undefined
            ? { [body.filterType]: body.filter }
            : body.filter,
        select: body.select,
        include: body.include,
        ...(sortKey &&
          sortValue && {
            orderBy: orderBy,
          }),
      });
      return {
        offset: body.offset || defaultPaginationOption.offset,
        limit: body.limit || defaultPaginationOption.limit,
        count: results.length,
        totalCount,
        documents: results,
      };
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async search({
    searchParams,
    filterType,
    sortParams,
    pageOption,
    selectFields,
    includeFields,
  }: {
    searchParams: typeof SearchOption;
    filterType: FilterTypeEnum;
    sortParams: typeof SortOption;
    pageOption: PaginationOption;
    selectFields: typeof SelectedOption;
    includeFields: typeof IncludeOption;
  }) {
    try {
      const totalCount = await this.model.count({
        where: { [filterType]: searchParams },
      });
      console.log({ [filterType]: searchParams });
      const results = await this.model.findMany({
        skip: pageOption.offset,
        take: pageOption.limit,
        where: { [filterType]: searchParams },
        orderBy: sortParams,
        select: selectFields,
        include: includeFields,
      });
      return {
        limit: pageOption.limit,
        offset: pageOption.offset,
        count: results.length,
        totalCount,
        documents: results,
      };
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllWithoutFilter() {
    try {
      return await this.model.findMany();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(
    id: string,
    includeFields?: any,
    throwErrorIfNotFound = false,
  ) {
    try {
      const result = await this.model.findFirst({
        where: { id },
        ...(includeFields && { include: includeFields }),
      });
      if (!result && throwErrorIfNotFound) {
        throw new NotFoundException(apiResponseMessage.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  /* ------------------------------ Update ------------------------------ */

  async update(id: string, updateDto: any, throwErrorIfNotFound = false) {
    // updateDTO = { key: value }
    try {
      const original = await this.model.findUnique({ where: { id } });
      const result = await this.model.update({
        where: { id },
        data: updateDto,
      });
      if (!result && throwErrorIfNotFound) {
        throw new HttpException('Error: Item not found', HttpStatus.NOT_FOUND);
      }
      return {
        original: original,
        modified: result,
      };
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // items is because its an array of the items to be updated
  async updateAll(items: any[], onlyCreate = false) {
    // items = { id: id , key : values }
    try {
      await Promise.all(
        items.map(async (data) => {
          const { id } = data;
          return id && !onlyCreate
            ? this.model.update({
                where: { id },
                data,
              })
            : this.model.create({ data });
        }),
      );
      return { message: 'Updated All' };
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /* ------------------------------ Delete ------------------------------ */

  // TODO: soft delete using prisma middleware
  // https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware

  async remove(id: string, throwErrorIfNotFound = false) {
    const result = await this.model.delete({ where: { id } });
    if (!result && throwErrorIfNotFound) {
      throw new HttpException('Error: Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  // async removeAll(filterParams: typeof FilterOption) {
  //   // Filter = { <FIELD>: { contains: 'stringToDelete'} }
  //   try {
  //     const result = await this.model.deleteMany({ where: { filterParams } });
  //     return { id: , documents: result };
  //   } catch (error) {
  //     throw new HttpException(`Error: ${error.message}`, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
