import { IsNotEmpty, IsString } from 'class-validator';

export class ParseParamsDto {
  @IsNotEmpty() @IsString() parameters: string;
}
