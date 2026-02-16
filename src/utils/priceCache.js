// utils/priceCache.js
class PriceCache {
  constructor(ttl = 60000) { // 1 menit default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

// Rate limiter untuk CoinGecko (30 requests/min)
class RateLimiter {
  constructor(maxRequests = 25, timeWindow = 60000) { // Pakai 25 untuk safety
    this.requests = [];
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      console.log(`Rate limit: waiting ${Math.ceil(waitTime/1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(Date.now());
  }
}

export const priceCache = new PriceCache();
export const rateLimiter = new RateLimiter();
