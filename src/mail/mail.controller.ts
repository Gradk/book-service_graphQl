import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  //mail/test?token=123

  @Get('/confirm')
  confirm(@Query('token') token: string) {
    return this.mailService.confirmEmail(token);
  }
}
