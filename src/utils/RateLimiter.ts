
interface RateLimitRecord {
  count: number;
  lastAttempt: number;
}

/**
 * A simple rate limiting utility to prevent abuse and brute force attacks
 */
export class RateLimiter {
  private attempts: Map<string, RateLimitRecord>;
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly whitelistedIPs: Set<string>;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.whitelistedIPs = new Set(['127.0.0.1', 'localhost']);
  }

  /**
   * Check if a key is rate limited
   * @param key The key to check (usually an IP or user identifier)
   * @returns Whether the key is rate limited
   */
  isRateLimited(key: string): boolean {
    if (this.whitelistedIPs.has(key)) {
      return false; // Don't rate limit whitelisted IPs
    }
    
    const now = Date.now();
    const record = this.attempts.get(key);
    
    // If no record exists or window has expired, create new record
    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }
    
    // Increment count and update last attempt
    record.count += 1;
    record.lastAttempt = now;
    this.attempts.set(key, record);
    
    // Check if over limit
    return record.count > this.maxAttempts;
  }

  /**
   * Record an attempt without checking if rate limited
   * @param key The key to record an attempt for
   */
  recordAttempt(key: string): void {
    if (this.whitelistedIPs.has(key)) {
      return; // Don't track attempts for whitelisted IPs
    }
    
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
    } else {
      record.count += 1;
      record.lastAttempt = now;
      this.attempts.set(key, record);
    }
  }

  /**
   * Get remaining attempts before rate limiting kicks in
   * @param key The key to check
   */
  getRemainingAttempts(key: string): number {
    if (this.whitelistedIPs.has(key)) {
      return this.maxAttempts; // Whitelisted IPs always have maximum attempts
    }
    
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now - record.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - record.count);
  }

  /**
   * Add an IP address to the whitelist
   * @param ip IP address to whitelist
   */
  addToWhitelist(ip: string): void {
    this.whitelistedIPs.add(ip);
  }

  /**
   * Remove an IP address from the whitelist
   * @param ip IP address to remove from whitelist
   */
  removeFromWhitelist(ip: string): void {
    this.whitelistedIPs.delete(ip);
  }

  /**
   * Reset rate limiting for a key
   * @param key The key to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Reset all rate limiting data
   */
  resetAll(): void {
    this.attempts.clear();
  }
}

// Create and export singleton instances for different operations
export const loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 API calls per minute
export const passwordResetRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
export const registerRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
export const sensitiveOperationLimiter = new RateLimiter(10, 600000); // 10 attempts per 10 minutes
