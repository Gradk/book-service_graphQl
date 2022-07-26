import { HttpException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminInput } from './inputs/create-admin.input';
import { UpdateAdminInput } from './inputs/update-admin.input';
import { AdminEntityToken } from './entities/admin-token.entity';
import { LoginAdminInput } from './inputs/login-admin.input';
import { MailService } from '../mail/mail.service';
import { Admin } from './decorators/admin.decorator';
import { ResetPasswordAdminInput } from './inputs/reset-password';
import { AuthGuard } from './guards/auth.guard';

@Resolver('Admin')
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailService: MailService,
  ) {}

  @Mutation(() => AdminEntityToken)
  async createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput,
  ): Promise<AdminEntityToken> {
    const admin = await this.adminService.createAdmin(createAdminInput);
    const sendMail = await this.mailService.sendUserConfirmation(
      createAdminInput,
    );
    return this.adminService.generateTokenSession(admin);
  }

  //не хватает функции - повторно отправить письмо подтверждения почты

  @Mutation(() => AdminEntityToken)
  async loginAdmin(
    @Args('LoginAdminInput') loginAdminInput: LoginAdminInput,
  ): Promise<AdminEntityToken> {
    const admin = await this.adminService.loginAdmin(loginAdminInput);

    return this.adminService.generateTokenSession(admin);
  }

  @Query(() => [AdminEntity])
  async getAllAdmins(): Promise<AdminEntity[]> {
    return await this.adminService.getAllAdmins();
  }

  @Query(() => AdminEntity)
  async getOneAdmin(@Args('id_admin') id_admin: number): Promise<AdminEntity> {
    return await this.adminService.getOneAdmin(id_admin);
  }

  @Query(() => AdminEntity)
  async getAdminByEmail(@Args('email') email: string): Promise<AdminEntity> {
    return await this.adminService.getAdminByEmail(email);
  }

  @Mutation(() => AdminEntity)
  async updateAdmin(
    @Args('id') id: number,
    @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
  ): Promise<AdminEntity> {
    try {
      return this.adminService.updateAdmin(
        updateAdminInput.id_admin,
        updateAdminInput,
      );
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  @Mutation(() => Number)
  async remove(@Args('id_admin') id_admin: number): Promise<any> {
    return await this.adminService.removeAdmin(id_admin);
  }

  @Mutation(() => String)
  async forgotPassword(@Args('email') email: string): Promise<string> {
    const worked = await this.adminService.forgotPassword(email);
    const sendMail = await this.mailService.forgotPassword(worked);

    return 'Письмо успешно отправлено';
  }

  // What went wrong is intentionally not sent (wrong username or code or user not in reset status)
  @Mutation(() => AdminEntity)
  async resetPassword(
    @Args('resetPasswordAdminInput')
    resetPassInput: ResetPasswordAdminInput,
  ): Promise<AdminEntity> {
    const admin = await this.adminService.resetPassword(resetPassInput);

    return admin;
  }

  @Query(() => AdminEntity)
  @UseGuards(AuthGuard) //раскидать везде защиту по админу
  async testGetOneAdmin(
    // @Admin() admin: AdminEntity не нужен
    @Args('id_admin')
    id_admin: number,
  ): Promise<AdminEntity> {
    return await this.adminService.getOneAdmin(id_admin);
  }
}
