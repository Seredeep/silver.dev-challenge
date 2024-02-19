import { UUID, randomUUID } from "crypto";
import { Account } from "./account/account";

export class User {
    id: UUID;
    name: string;
    email: string;
    password: string;
    accounts: Account[] = [];

    constructor(name: string, email: string, password: string) {
        this.id = randomUUID();
        this.name = name;
        this.email = email;
        this.password = password;
        this.accounts = [];
    }
}
