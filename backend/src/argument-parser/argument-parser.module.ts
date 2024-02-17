import { Module } from '@nestjs/common';
import { ArgumentParserService } from './argument-parser.service';

@Module({
  providers: [ArgumentParserService],
})
export class ArgumentParserModule {}
