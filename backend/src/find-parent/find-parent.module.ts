import { Module } from '@nestjs/common';
import { FindParentService } from './find-parent.service';

@Module({
  providers: [FindParentService],
  exports: [FindParentService],
})
export class FindParentModule {}
