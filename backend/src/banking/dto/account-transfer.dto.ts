import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class AccountTransferDto {
    @IsUUID()
    destinationUserId: UUID;
}