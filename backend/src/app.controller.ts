import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Method to test the argument parser
   */
  @Post('/parse')
  parseParams(@Body() body): string {
    if (body.parameters === undefined) {
      return 'No parameters provided';
    }
    return this.appService.parseParams(body.parameters);
  }
}
