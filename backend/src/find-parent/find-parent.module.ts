import { Module } from '@nestjs/common';
import { FindParentService } from './find-parent.service';

@Module({
  providers: [FindParentService]
})
export class FindParentModule {}
