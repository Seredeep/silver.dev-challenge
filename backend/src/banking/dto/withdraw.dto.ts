import { IsNumber, IsPositive, IsUUID, isUUID } from "class-validator";
import { UUID } from "crypto";

export class WithdrawDto {
    @IsNumber() @IsPositive()
    amount: number;

    @IsUUID()
    accountId: UUID;
}