import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { UserModule } from './user/user.module';
import { BankingController } from './banking.controller';
import { UserService } from './user/user.service';

@Module({
  providers: [BankingService, UserService],
  imports: [UserModule],
  controllers: [BankingController]
})
export class BankingModule {}
