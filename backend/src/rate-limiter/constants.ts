export interface RateLimiterOptions {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum number of requests allowed in the window
    initialBackoffMs: number; // Initial backoff time in milliseconds
}
