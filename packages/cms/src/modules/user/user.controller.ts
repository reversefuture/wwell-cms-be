import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { ParseObjectIdPipe } from 'common/pipes/parse-id.pipe';
import { PrismaService } from 'db/prisma.service';
import { apiResponseMessage, authResponseMessage } from 'constants/response-messages.constant';
import { UserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Pagination } from 'common/decorator/pagination.decorator';
import { PaginationOption } from 'common/pagination/pagination.query';
import { RequestWithUser } from 'types/requestTypes';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  /**
   * get list of user
   */
  @Get('')
  // @Profiles([Profile.ADMIN])
  async listUser(
    @Pagination() pageOption: PaginationOption,
    @Query() queryDto: UpdateUserDto,
  ) {
    const result = await this.userService.getListPaged(queryDto, pageOption)
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.GET_SUCCESS,
      data: result,
    };
  }

  /**
   * Create a User
   */
  @Post('')
  // @Profiles([Profile.ADMIN])
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() createDto: UserDto) {
    const User = await this.userService.createUser(createDto);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.POST_SUCCESS,
      data: User,
    };
  }

  /**
   * update a User
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @Req() {user}: RequestWithUser
  ) {
    if( id !== user.id){
      throw new UnauthorizedException(authResponseMessage.UNAUTHORIZED);
    }
    const User = await this.userService.updateUser(id, dto);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.PUT_SUCCESS,
      data: User,
    };
  } 

  @Delete(':id')
  // @Profiles([Profile.ADMIN])
  async deleteImage(@Param('id', new ParseObjectIdPipe()) id: string) {
    const User = await this.userService.getById(id);
    if (!User) {
      throw new NotFoundException(apiResponseMessage.NOT_FOUND);
    }

    const result = await this.userService.deleteUser(id);
    return {
      code: HttpStatus.OK,
      message: apiResponseMessage.DELETE_SUCCESS,
      data: result,
    };
  }
}
