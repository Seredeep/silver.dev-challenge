import { HttpException, Injectable } from '@nestjs/common';
import { User } from './user/user';
import { Transaction, TransactionType } from './transaction/transaction';
import { UserService } from './user/user.service';
import { UUID } from 'crypto';

@Injectable()
export class BankingService {
    
    //make accounts, deposits, withdrawals, and account transfers
    private users: User[] = [];
    private transactions: Transaction[] = [];

    constructor(
        private userService: UserService
    ){}
    
    createUser(name:string, email:string, password:string) {
        const user = new User(name, email, password);
        this.users.push(user);
        return user;
    }

    createAccount(name:string, userId:UUID, balance:number) {
        const user = this.users.find(user => user.id === userId);
        if(!user) throw new HttpException('User not found', 404);
        
        this.userService.createAccount(user, name, balance);
        return user.accounts[user.accounts.length - 1];
    }

    deposit(accountId:UUID, amount:number) {
        const user = this.users.find(user => user.accounts.find(account => account.id === accountId));
        const account = user.accounts.find(account => account.id === accountId);
        if(!user || !account) throw new HttpException('Account not found', 404);
        account.deposit(amount);
        this.transactions.push(new Transaction(TransactionType.DEPOSIT,account.id, user.id,amount));
    }

    withdraw(accountId:UUID, amount:number) {
        const user = this.users.find(user => user.accounts.find(account => account.id === accountId));
        const account = user.accounts.find(account => account.id === accountId);
        if(!user || !account) throw new HttpException('Account not found', 404);
        account.withdraw(amount);
        this.transactions.push(new Transaction(TransactionType.WITHDRAWAL,account.id, user.id,amount));
    }

    transfer(originAccountId:UUID, destinationAccountId:UUID, amount:number) {
        const originUser = this.users.find(user => user.accounts.find(account => account.id === originAccountId));
        const originAccount = originUser.accounts.find(account => account.id === originAccountId);
        const destinationUser = this.users.find(user => user.accounts.find(account => account.id === destinationAccountId));
        const destinationAccount = destinationUser.accounts.find(account => account.id === destinationAccountId);
        if(!originUser || !originAccount) throw new HttpException('Origin ccount not found', 404);
        if(!destinationUser || !destinationAccount) throw new HttpException('Destination account not found', 404);
        originAccount.withdraw(amount);
        destinationAccount.deposit(amount);
        this.transactions.push(new Transaction(TransactionType.TRANSFER,originAccount.id, originUser.id,amount,destinationAccount.id, destinationUser.id));
    }

    accountTransfer(accountId:UUID, destinationUserId:UUID)
    {
        const user = this.users.find(user => user.accounts.find(account => account.id === accountId));
        const account = user.accounts.find(account => account.id === accountId);
        const destinationUser = this.users.find(user => user.id === destinationUserId);
        if(!user || !account) throw new HttpException('Account not found', 404);
        if(!destinationUser) throw new HttpException('Destination user not found', 404);
        this.userService.transferAccount(user, account, destinationUser);
    }

    getBalance(accountId: UUID) {
        const user = this.users.find(user => user.accounts.find(account => account.id === accountId));
        const account = user.accounts.find(account => account.id === accountId);
        if(!user || !account) throw new HttpException('Account not found', 404);
        return account.balance;
    }

}
