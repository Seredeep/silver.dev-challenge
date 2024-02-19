import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { RateLimiter } from 'src/rate-limiter/rate-limiter.decorator';
import { RateLimiterInterceptor } from 'src/rate-limiter/rate-limiter.interceptor';
import { BankingService } from './banking.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { AccountTransferDto } from './dto/account-transfer.dto';
import { isUUID } from 'class-validator';
import { UUID } from 'crypto';

@UseInterceptors(RateLimiterInterceptor)
@RateLimiter({windowMs: 100000, maxRequests: 5, initialBackoffMs: 5000})
@Controller('banking')
export class BankingController {
    constructor(private readonly bankingService: BankingService) {}

    @Post('/user')
    createUser(@Body() userDto: CreateUserDto) {
        const { name, email, password } = userDto;
        return this.bankingService.createUser(name, email, password);
    }
    
    @Get('/account/:accountId')
    getBalance(@Param('accountId') accountId: UUID) {
        if (!isUUID(accountId)) {
            throw new BadRequestException('Invalid accountId');
        }
        return this.bankingService.getBalance(accountId);
    }
    
    @Post('/account')
    createAccount(@Body() accountDto: CreateAccountDto) {
        const { name, userId, balance } = accountDto;
        return this.bankingService.createAccount(name, userId, balance);
    }

    @Patch('/account/:accountId')
    accountTransfer(@Body() accountTransferDto: AccountTransferDto, @Param('accountId') accountId: UUID){
        const {destinationUserId } = accountTransferDto;

        if (!isUUID(accountId)) {
            throw new BadRequestException('Invalid accountId');
        }
        return this.bankingService.accountTransfer(accountId, destinationUserId);
    }

    @Post('/deposit')
    deposit(@Body() depositDto: DepositDto) {
        const { accountId, amount } = depositDto;
        return this.bankingService.deposit(accountId, amount);
    }

    @Post('/withdraw')
    withdraw(@Body() withdrawDto: WithdrawDto) {
        const { accountId, amount } = withdrawDto;
        return this.bankingService.withdraw(accountId, amount);
    }

    @Post('/transfer')
    transfer(@Body() transferDto: TransferDto) {
        const { originAccountId, destinationAccountId, amount } = transferDto;
        return this.bankingService.transfer(originAccountId, destinationAccountId, amount);
    }

    
}
