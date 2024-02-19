import { IsNegative, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateAccountDto
{
    @IsString() @IsNotEmpty()
    name: string;

    @IsNumber() @IsNotEmpty() @IsPositive()
    balance: number;

    @IsUUID()
    userId: UUID;
}