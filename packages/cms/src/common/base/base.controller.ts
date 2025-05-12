import {
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { apiResponseMessage } from 'modules/shared/response-messages.constant';
import { Pagination } from '../decorator/pagination.decorator';
import { PaginationOption } from '../pagination/pagination.query';
import { ParseObjectIdPipe } from '../pipes/parse-id.pipe';
import { FilterTypeEnum } from '../types/fixedTypes';
import { BaseService } from './base.service';
import {
  FilterBodyOptions,
  FilterType,
  IncludeOption,
  SearchOption,
  SelectedOption,
  SortOption,
} from './decorator';
import { APIResponse } from 'types/apiSpec';

export class BaseController<CreateDto> extends BaseService<CreateDto> {
  constructor(model: any) {
    super(model); // passes the model to the services class
  }

  @Post()
  @ApiExcludeEndpoint()
  async create(@Body() createDto: CreateDto): Promise<APIResponse> {
    const data = await super.create(createDto);
    return {
      code: HttpStatus.CREATED,
      message: apiResponseMessage.POST_SUCCESS,
      data,
    };
  }

  @Post('/filter') // VIA body json
  @ApiExcludeEndpoint()
  async filterAll(
    @FilterBodyOptions() bodyJSON: typeof FilterBodyOptions,
  ): Promise<APIResponse> {
    const data = await super.bodyFilter(bodyJSON);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.POST_SUCCESS,
      data,
    };
  }

  @Get('/search')
  @ApiExcludeEndpoint()
  async searchAll(
    @SearchOption() searchParams: typeof SearchOption,
    @SortOption() sortParams: typeof SortOption,
    @Pagination() pageOption: PaginationOption,
    @FilterType() filterType: FilterTypeEnum,
    @SelectedOption() selectFields: typeof SelectedOption,
    @IncludeOption() includeFields: typeof IncludeOption,
  ): Promise<APIResponse> {
    const data = await super.search({
      searchParams,
      sortParams,
      filterType,
      pageOption,
      selectFields,
      includeFields,
    });
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.GET_SUCCESS,
      data,
    };
  }

  @Get()
  @ApiExcludeEndpoint()
  async findAll(): Promise<APIResponse> {
    const data = await super.findAllWithoutFilter();
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.GET_SUCCESS,
      data,
    }; // Success
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  async findOne(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<APIResponse> {
    const data = await super.findById(id, true);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.GET_SUCCESS,
      data,
    };
  }

  @Put(':id')
  @ApiExcludeEndpoint()
  async updateOne(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updateDto: CreateDto,
  ): Promise<APIResponse> {
    const data = await super.update(id, updateDto, true);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.PUT_SUCCESS,
      data,
    };
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  async removeOne(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<APIResponse> {
    const data = await super.remove(id, true);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.DELETE_SUCCESS,
      data,
    };
  }
}
