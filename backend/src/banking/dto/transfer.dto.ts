import { IsNumber, IsPositive, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TransferDto {
    @IsNumber() @IsPositive()
    amount: number;

    @IsUUID()
    originAccountId: UUID;

    @IsUUID()
    destinationAccountId: UUID;

}