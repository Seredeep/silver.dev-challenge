import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RateLimiterOptions } from './constants';
import { RATE_LIMITER_OPTIONS } from './rate-limiter.decorator';
import { Request, Response } from 'express';

interface RateLimiterRequest {
  count: number;
  resetTime: number;
  backoffTime: number;
  lastRequestTime: number;
  retryCount: number;
  lastRetryTime: number;
}

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private requests: Map<string, RateLimiterRequest> = new Map();

  constructor(private reflector: Reflector) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let options = this.reflector.get<RateLimiterOptions>(
        RATE_LIMITER_OPTIONS,
        context.getHandler()
    );
    if (!options) {
      options = this.reflector.get<RateLimiterOptions>(
        RATE_LIMITER_OPTIONS,
        context.getClass()
      );
      if(!options) return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    const response: Response = httpContext.getResponse();

    const path = request.baseUrl + request.path;
    const method = request.method;
    
    // Construct the full path by combining the controller and handler paths
    const fullPath = `${path}${method}`;

    const ip = request.ip;
    const key = `${ip}-${fullPath}`;
    
    if (!ip) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const currentTime = Date.now();
    const record = this.requests.get(key) || {
        count: 0,
        resetTime: currentTime + options.windowMs,
        backoffTime: 0,
        lastRequestTime: currentTime,
        retryCount: 0,
        lastRetryTime: 0,
    };

    if (currentTime > record.resetTime) {
        // Reset the count and time window
        record.count = 1;
        record.resetTime = currentTime + options.windowMs;
        record.lastRequestTime = currentTime;
        if (
            record.retryCount > 0 &&
            currentTime - record.lastRetryTime > record.backoffTime
        ) {
            record.retryCount = 0;
            record.backoffTime = 0;
            record.lastRetryTime = 0;
        }

        this.requests.set(key, record);
        return next.handle();
    }

    if (record.count >= options.maxRequests) {
        // Set the Retry-After header to indicate when the client can try again
        record.retryCount++;
        record.backoffTime = this.calculateBackoffTime(
            record.retryCount,
            options.initialBackoffMs,
        );
        record.lastRetryTime = currentTime;
        this.requests.set(key, record);
        response.set('Retry-After', record.backoffTime.toString());
        throw new HttpException(
            'Too Many Requests',
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }

    // Increment the request count and continue
    record.count++;
    this.requests.set(key, record);
    return next.handle();
  }

  private calculateBackoffTime(retryCount, initialBackoffTime) {
    return initialBackoffTime * Math.pow(2, retryCount - 1);
}
}
