import { SetMetadata } from '@nestjs/common';
import { RateLimiterOptions } from './constants';

export const RATE_LIMITER_OPTIONS = 'rate-limiter-options';
export const RateLimiter = (options: RateLimiterOptions) =>
    SetMetadata(RATE_LIMITER_OPTIONS, options);
