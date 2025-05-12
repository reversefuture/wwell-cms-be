import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../auth/authentication.module';
import { EmailsService } from './emails.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  providers: [
    EmailsService,
    UserService,
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
