import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { MailModule } from '../mail/mail.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), MailModule],
  providers: [AdminResolver, AdminService, AuthGuard],
})
export class AdminModule {}
