
/**
 * Service for caching API responses
 */
class ApiCacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private maxCacheSize: number = 100;
  private defaultTtl: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Get an item from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > this.defaultTtl) {
      // Item expired
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Store an item in the cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Ensure cache doesn't grow too large
    if (this.cache.size >= this.maxCacheSize) {
      // Remove the oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, { 
      data, 
      timestamp: Date.now() 
    });
  }

  /**
   * Remove an item from the cache
   */
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Remove all items matching a pattern
   */
  invalidateByPattern(pattern: string | RegExp): number {
    let count = 0;
    
    this.cache.forEach((_, key) => {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    });
    
    return count;
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache usage statistics
   */
  getStats(): { size: number; maxSize: number; usage: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      usage: this.cache.size / this.maxCacheSize
    };
  }

  /**
   * Configure the cache service
   */
  configure(options: { maxSize?: number; defaultTtl?: number }): void {
    if (options.maxSize !== undefined) {
      this.maxCacheSize = options.maxSize;
    }
    
    if (options.defaultTtl !== undefined) {
      this.defaultTtl = options.defaultTtl;
    }
  }
}

// Export a singleton instance
const apiCacheService = new ApiCacheService();
export default apiCacheService;
