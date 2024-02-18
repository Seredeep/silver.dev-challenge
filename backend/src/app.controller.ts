import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ParseParamsDto } from './dto/parse-params.dto';
import { FindParentDto } from './dto/find-parent.dto';
import { RateLimiter } from './rate-limiter/rate-limiter.decorator';
import { RateLimiterInterceptor } from './rate-limiter/rate-limiter.interceptor';

@UseInterceptors(RateLimiterInterceptor)
@RateLimiter({windowMs: 100000, maxRequests: 5, initialBackoffMs: 5000})
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

    /**
     * Method to test the find parent function
     */
    @Post('/find-parent')
    findParent(@Body() findParentDto: FindParentDto): string {
        return this.appService.findParent(
            findParentDto.root,
            findParentDto.child,
            findParentDto.parent,
        );
    }
}
