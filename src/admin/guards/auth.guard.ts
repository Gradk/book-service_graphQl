import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminService } from '../admin.service';
import { verify } from 'jsonwebtoken';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const newctx = GqlExecutionContext.create(context);
    const adminAuthToken = newctx.getContext().req.headers.authorization;

    const decode = verify(adminAuthToken, process.env.JWT_SECRET);

    const admin = await this.adminService.getAdminByEmail(decode);

    if (!admin) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
