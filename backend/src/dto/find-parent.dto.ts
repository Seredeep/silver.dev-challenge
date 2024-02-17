import { IsNotEmpty, IsString } from 'class-validator';

export class FindParentDto {
  @IsNotEmpty() @IsString() root: string;
  @IsNotEmpty() @IsString() parent: string;
  @IsNotEmpty() @IsString() child: string;
}
