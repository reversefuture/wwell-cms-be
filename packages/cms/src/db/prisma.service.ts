import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { union } from 'lodash';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();

    /***********************************/
    /* SOFT DELETE MIDDLEWARE */
    /***********************************/

    this.$use(async (params, next) => {
      // !Issue 1: this won't works with compound unique constraints (e.g. TokenhuntProgress.userTokenhuntId not in the WhereInput after amendment)
      // !Issue 2: this won't supports admin access to soft-deleted content from the CMS admin portal
      // if (params.action === 'findUnique' || params.action === 'findFirst') {
      //   // Change to `findFirst` - you cannot filter
      //   // by anything except ID / unique with findUnique
      //   params.action = 'findFirst';
      //   // Add 'isDeleted' filter
      //   params.args.where['isDeleted'] = false;
      // }
      // if (params.action === 'findMany') {
      //   if (params.args.where) {
      //     const andOperator = params.args.where['AND'];
      //     if (Array.isArray(andOperator)) {
      //       params.args.where['AND'] = union(andOperator, [
      //         { isDeleted: false },
      //       ]);
      //     } else if (params.args.where.isDeleted == undefined) {
      //       params.args.where['isDeleted'] = false;
      //     }
      //   } else {
      //     params.args['where'] = { isDeleted: false };
      //   }
      // }

      if (params.action == 'delete') {
        params.action = 'update'; // change to `update`
        params.args['data'] = { isDeleted: true };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany'; // change to `updateMany`
        if (params.args.data != undefined) {
          params.args.data['isDeleted'] = true;
        } else {
          params.args['data'] = { isDeleted: true };
        }
      }

      return next(params);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    Logger.log('Prisma Connected to DataBase', 'PRISMA');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
