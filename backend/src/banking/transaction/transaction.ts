import { UUID } from "crypto";

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER'
}

export class Transaction {
    type: TransactionType;
    originAccount: UUID;
    originUser: UUID;
    destinationAccount?: UUID;
    destinationUser?: UUID;
    amount: number;
    timestamp: Date = new Date();
    constructor(type: TransactionType,originAccount: UUID, originUser: UUID, amount: number, destinationAccount?: UUID, destinationUser?: UUID) {
        this.originAccount = originAccount;
        this.originUser = originUser;
        this.destinationAccount = destinationAccount;
        this.destinationUser = destinationUser;
        this.amount = amount;
        this.type = type;
    }
}
