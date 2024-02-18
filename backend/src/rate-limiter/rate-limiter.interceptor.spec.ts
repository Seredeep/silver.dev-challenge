import { RateLimiterInterceptor } from './rate-limiter.interceptor';

describe('RateLimiterInterceptor', () => {
  it('should be defined', () => {
    expect(new RateLimiterInterceptor()).toBeDefined();
  });
});
