import { erc20Abi } from 'viem';
import { publicClient } from '../wagmi/config'; // Import publicClient dari wagmi config

// Cache untuk menyimpan harga
interface PriceCache {
  price: number;
  timestamp: number;
}

class PriceService {
  private cache: Map<string, PriceCache> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 menit cache
  private readonly RATE_LIMIT_DELAY = 1000; // 1 detik antar request
  private lastRequestTime: number = 0;

  // CoinGecko IDs untuk token di BSC
  private readonly coinGeckoIds = {
    BNB: 'binancecoin',
    USDT: 'tether',
    USDC: 'usd-coin',
    LIQ: 'liq' // dummy ID, akan pakai harga manual
  };

  async getPrice(symbol: string): Promise<number> {
    // Cek cache dulu
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`🔄 Using cached price for ${symbol}: $${cached.price}`);
      return cached.price;
    }

    // Harga dummy untuk LIQ
    if (symbol === 'LIQ') {
      return 0.005;
    }

    try {
      // Rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
        await new Promise(resolve =>
          setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest)
        );
      }

      // Fetch dari CoinGecko (free API, 30 calls/min)
      const id = this.coinGeckoIds[symbol as keyof typeof this.coinGeckoIds];
      if (!id) return 0;

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

      console.log(`🌐 Fetching ${symbol} price from CoinGecko...`);

      const response = await fetch(url);
      this.lastRequestTime = Date.now();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const price = data[id]?.usd || 0;

      // Simpan ke cache
      this.cache.set(symbol, {
        price,
        timestamp: Date.now()
      });

      console.log(`✅ ${symbol} price: $${price}`);
      return price;

    } catch (error) {
      console.error(`❌ Error fetching ${symbol} price:`, error);

      // Fallback ke cache lama atau harga default
      if (cached) {
        console.log(`⚠️ Using expired cache for ${symbol}: $${cached.price}`);
        return cached.price;
      }

      // Fallback harga
      const fallbackPrices = {
        BNB: 320,
        USDT: 1,
        USDC: 1,
        LIQ: 0.005
      };

      return fallbackPrices[symbol as keyof typeof fallbackPrices] || 0;
    }
  }

  async getMultiplePrices(symbols: string[]): Promise<Map<string, number>> {
    const prices = new Map();

    // Filter symbols yang perlu di-fetch
    const needFetch = symbols.filter(s => {
      const cached = this.cache.get(s);
      return !cached || Date.now() - cached.timestamp >= this.CACHE_DURATION;
    });

    // Pakai harga dari cache dulu
    symbols.forEach(s => {
      const cached = this.cache.get(s);
      if (cached) {
        prices.set(s, cached.price);
      }
    });

    // Fetch harga yang belum ada di cache
    for (const symbol of needFetch) {
      if (symbol === 'LIQ') {
        prices.set('LIQ', 0.005);
        continue;
      }

      const price = await this.getPrice(symbol);
      prices.set(symbol, price);

      // Delay antar request
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return prices;
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Price cache cleared');
  }
}

export const priceService = new PriceService();
