import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArgumentParserModule } from './argument-parser/argument-parser.module';
import { FindParentModule } from './find-parent/find-parent.module';


@Module({
    imports: [ArgumentParserModule, FindParentModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
