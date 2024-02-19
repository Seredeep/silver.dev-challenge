import { IsNumber, IsPositive, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class DepositDto
{
    @IsUUID()
    accountId: UUID;

    @IsNumber() @IsPositive()
    amount: number;
}