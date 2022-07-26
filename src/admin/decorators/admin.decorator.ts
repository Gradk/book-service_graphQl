import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  sign,
  verify,
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { AdminService } from '../admin.service';
import { Repository } from 'typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

export const Admin = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const newctx = GqlExecutionContext.create(ctx);
    const adminAuthToken = newctx.getContext().req.headers.authorization;

    const test = newctx.getContext().req;

    return;
  },
);
