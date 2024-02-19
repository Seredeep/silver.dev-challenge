import { UUID, randomUUID } from "crypto";

export class Account {
    id: UUID;
    name: string;
    balance: number;
    constructor(name: string, balance: number) {
        this.id = randomUUID();
        this.name = name;
        this.balance = balance;
    }

    deposit(amount: number) {
        if(amount < 0) throw new Error('Cannot deposit a negative amount');
        this.balance += amount;
    }

    withdraw(amount: number) {
        if(amount < 0) throw new Error('Cannot withdraw a negative amount');
        if(amount > this.balance) throw new Error('Insufficient funds');
        this.balance -= amount;
    }
}
