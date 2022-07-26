import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdminInput } from '../admin/inputs/create-admin.input';
import { MailerService } from '@nestjs-modules/mailer';
import {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, Repository } from 'typeorm';
import { AdminEntity } from '../admin/entities/admin.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async sendUserConfirmation(dto: CreateAdminInput) {
    const email = dto.email;
    const token = sign({ email }, process.env.JWT_SECRET);
    const url = `${process.env.API_HOST}:${process.env.API_PORT}/mail/confirm?token=${token}`;

    console.log(token);

    //в токене передаем мыло в зашифрованном виде

    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Cервис бронирования услуг, активируйте почту',
        template: '/templates/confirmation',
        from: process.env.MAIL_FROM_EMAIL, // sender address
        context: {
          name: dto.name,
          url: url,
        },
      })
      .then(() => {
        console.log('успех');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //из параметра дергаем токен, расшифровываем и ищем в бд
  async confirmEmail(token: string): Promise<String> {
    const decodeToken = verify(token, process.env.JWT_SECRET);

    const admin = await this.adminRepository.findOneBy({
      email: decodeToken.email,
    });

    if (!admin) {
      throw new HttpException('admin not found Error', 422);
    } else {
      await this.adminRepository.update(
        { email: decodeToken.email },
        { confirmEmail: true },
      );
      return;
    }
  }

  //отправляем письмо с кодом, который нужно будет ввести в форму восстановления пароля
  async forgotPassword(adminInput: AdminEntity): Promise<any> {
    const token = sign(
      {
        data: adminInput.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' },
    );

    await this.mailerService
      .sendMail({
        to: adminInput.email,
        subject: 'Сброс пароля',
        template: '/templates/resetPassword',
        from: process.env.MAIL_FROM_EMAIL, // sender address
        context: {
          token: token,
        },
      })
      .then(() => {
        console.log('успех');
      })
      .catch((e) => {
        console.log(e);
      });

    return '';
  }
}
