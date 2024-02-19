import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Account } from './account/account';

@Injectable()
export class UserService {

    createAccount(user: User, name: string, balance: number) {
        user.accounts.push(new Account(name, balance))
    }

    transferAccount(user:User ,account: Account, destinationUser: User) {
        user.accounts = user.accounts.filter(a => a.id !== account.id);
        destinationUser.accounts.push(account);
    }
}
