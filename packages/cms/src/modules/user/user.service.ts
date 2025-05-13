import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { BaseService } from 'common/base/base.service';
import { UserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'db/prisma.service';
import { PaginationOption } from 'common/pagination/pagination.query';
import { IBodyFilter } from 'types/dbTypes';
import { transformToSearchConditions } from 'utils/transformHelper';
import { ApiPageData } from 'types/apiSpec';
import { orderByEnum } from 'types/enums';
import { Profile, User } from '@prisma/client';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(prismaService: PrismaService) {
    super(prismaService.user); // initialize prismia conn for this.model
  }

  async createUser(createDto: UserDto) {
    try {
      let values = cloneDeep(createDto) as any;;
      let profileId = '';
      if (createDto.profileId) {
        profileId = createDto.profileId;
        delete createDto.profileId;
        values = {
          ...createDto,
          profile: {
            connect: {
              id: profileId,
            },
          },
        };
      }
      return await this.model.upsert({
        where: { email: values.email }, // use use unique key
        create: values,
        update: values,
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      let values = cloneDeep(dto) as any;
      let profileId = '';
      if (dto.profileId) {
        profileId = dto.profileId;
        delete dto.profileId;
        values = {
          ...dto,
          profile: {
            connect: {
              id: profileId,
            },
          },
        };
      }
      return await this.model.update({
        data: values,
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.model.remove({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getById(id: string): Promise<User & { profile?: Profile }> {
    return super.findById(id, { profile: true });
  }

  async getByName(username: string): Promise<User & { profile?: Profile }> {
    return this.model.findFirst(
      {
        where: {
          username: username,
        },
      },
      { profile: true },
    );
  }
  
  async getByEmail(email: string): Promise<User & { profile?: Profile }> {
    return this.model.findFirst(
      {
        where: {
          email: email,
        },
      },
      { profile: true },
    );
  }

  async getByMobile(mobile: string): Promise<User & { profile?: Profile }> {
    return this.model.findFirst(
      {
        where: {
          mobile: mobile,
        },
      },
      { profile: true },
    );
  }

  async getListPaged(
    queryDto: UpdateUserDto,
    pageOption: PaginationOption,
  ): Promise<ApiPageData> {
    try {
      const result = await this.bodyFilter({
        filter: transformToSearchConditions(queryDto),
        // filterType: 'AND',
        offset: pageOption.offset || 0,
        limit: pageOption.limit || 10,
        sortBy: pageOption.sortBy || 'createdAt',
        orderBy: pageOption.orderBy || orderByEnum.desc,
        include: {
          profile: true,
        },
      } as IBodyFilter);

      return result;
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  
  async setOTPSecret(secret: string, otpCounter: string, userId: string) {
    try {
      return await this.model.update({
        where: { id: userId },
        data: {
          otpSecret: secret,
          otpCounter: otpCounter,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async setOTPCounter(otpCounter: string, userId: string) {
    try {
      return await this.model.update({
        where: { id: userId },
        data: {
          otpCounter: otpCounter,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}
