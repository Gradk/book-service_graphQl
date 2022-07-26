import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminInput } from './inputs/create-admin.input';
import { UpdateAdminInput } from './inputs/update-admin.input';
import { AdminEntity } from './entities/admin.entity';
import { genSaltSync, hash, compare } from 'bcryptjs';
import { LoginAdminInput } from './inputs/login-admin.input';
import { AdminEntityToken } from './entities/admin-token.entity';
import {
  sign,
  verify,
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { ResetPasswordAdminInput } from './inputs/reset-password';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async createAdmin(AdminInput: CreateAdminInput): Promise<any> {
    const admin = await this.adminRepository.findOneBy({
      email: AdminInput.email,
    });

    //duplicate check logic
    if (admin) {
      throw new HttpException('admin Duplicate Error', 401);
    } else {
      const salt = genSaltSync(10);
      const newAdmin = new AdminEntity();

      newAdmin.name = AdminInput.name;
      newAdmin.email = AdminInput.email;
      newAdmin.password = await hash(AdminInput.password, salt);

      const result = await this.adminRepository.save({ ...newAdmin });

      delete result.password;

      return result;
    }
  }

  async loginAdmin(AdminInput: LoginAdminInput): Promise<any> {
    const admin = await this.adminRepository.findOneBy({
      email: AdminInput.email,
    });

    if (!admin) {
      throw new HttpException('admin not found', 422);
    }

    const isCorrectPassword = await compare(
      AdminInput.password,
      admin.password,
    );

    if (!isCorrectPassword) {
      throw new HttpException('admin password no correct', 422);
    }

    delete admin.password;

    return admin;
  }

  async generateTokenSession(
    admin: AdminEntityToken,
  ): Promise<AdminEntityToken> {
    const { email } = admin;
    const token = sign(email, process.env.JWT_SECRET);

    return {
      ...admin,
      token,
    };
  }

  async getOneAdmin(id_admin: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id_admin });
    if (admin) {
      return await this.adminRepository.findOneBy({ id_admin });
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async getAdminByEmail(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ email });

    if (admin) {
      return await this.adminRepository.findOneBy({ email });
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async getAllAdmins(): Promise<AdminEntity[]> {
    return await this.adminRepository.find();
  }

  async updateAdmin(
    id_admin: number,
    updateAdminInput: UpdateAdminInput,
  ): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id_admin });

    if (admin) {
      await this.adminRepository.update(
        { id_admin: updateAdminInput.id_admin },
        { ...updateAdminInput },
      );
      return await this.getOneAdmin(updateAdminInput.id_admin);
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async removeAdmin(id_admin: number): Promise<number> {
    const admin = await this.adminRepository.findOneBy({ id_admin });

    if (!admin) {
      throw new HttpException('user not found', 404);
    } else {
      await this.adminRepository.delete({ id_admin });
      return id_admin;
    }
  }

  async forgotPassword(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({
      email: email,
    });

    if (!admin) {
      throw new HttpException('admin not found', 422);
    }

    return admin;
  }

  //вводим в форму код из письма, почту, новый пароль, если совпало то запись
  async resetPassword(
    resetPassInput: ResetPasswordAdminInput,
  ): Promise<AdminEntity | undefined> {
    const admin = await this.adminRepository.findOneBy({
      email: resetPassInput.email,
    });

    try {
      const decode = verify(resetPassInput.code, process.env.JWT_SECRET);
      //если токен коррентный и не истек
      if (decode.exp > Math.floor(Date.now() / 1000)) {
        //если почта подтверждена
        if (admin.confirmEmail) {
          //обновляем юзера

          const salt = genSaltSync(10);

          const newPassword = await hash(resetPassInput.password, salt);

          await this.adminRepository.update(
            { email: resetPassInput.email },
            { password: newPassword },
          );
        }
      }
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        console.log('не корректный токен');
        throw new HttpException('nocorrect token Error', 422);
      }

      if (err instanceof TokenExpiredError) {
        console.log('токен истек');
        throw new HttpException('token exp Error', 422);
      }
    }

    return admin;
  }
}
