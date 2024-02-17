import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ParseParamsDto } from './dto/parse-params.dto';
import { FindParentDto } from './dto/find-parent.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Method to test the argument parser
   */
  @Post('/parse')
  parseParams(@Body() parseParamsDto: ParseParamsDto): string {
    return this.appService.parseParams(parseParamsDto.parameters);
  }

  @Post('/find-parent')
  findParent(@Body() findParentDto: FindParentDto): string {
    return this.appService.findParent(
      findParentDto.child,
      findParentDto.parent,
    );
  }
}
