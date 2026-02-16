// services/yieldService.js
import { BeefyService } from './beefyService';

// Simple cache
class YieldCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 menit default
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
}

const cache = new YieldCache();

export class YieldService {
  constructor() {
    this.beefy = new BeefyService();
  }

  async getAllYields({ chain = 'bsc', minApr = 5, limit = 20 } = {}) {
    const cacheKey = `yields-${chain}-${minApr}-${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log('Using cached Beefy data');
      return cached;
    }

    try {
      console.log('Fetching fresh Beefy data...');

      // Only fetch from Beefy
      const beefyYields = await this.getBeefyYields({ chain, minApr, limit });

      // Sort by APR
      const allYields = beefyYields
        .sort((a, b) => b.apr - a.apr)
        .slice(0, limit);

      // Kalau kosong, return empty array (no mock data)
      if (allYields.length === 0) {
        return [];
      }

      // Simpan di cache
      cache.set(cacheKey, allYields);

      return allYields;
    } catch (error) {
      console.error('Error fetching yields:', error);
      return []; // Return empty array, no mock data
    }
  }

  async getBeefyYields({ chain = 'bsc', minApr = 5, limit = 20 } = {}) {
    try {
      const vaults = await this.beefy.fetchVaults();
      const apyMap = await this.beefy.fetchApy();
      const lpBreakdown = await this.beefy.fetchLpBreakdown();

      return vaults
        .filter(v => v.chain === chain || v.network === chain)
        .filter(v => v.status !== 'eol')
        .map(v => {
          const apr = apyMap[v.id] ? apyMap[v.id] * 100 : 0;
          const tvl = this.beefy.resolveLpTvl(v, lpBreakdown);
          const type = this.beefy.detectType(v);

          return {
            id: `beefy-${v.id}`,
            protocol: 'Beefy Finance',
            protocolIcon: '🐮',
            pool: v.name,
            chain: v.chain || v.network,
            type,
            token0: v.assets?.[0] || 'TOKEN',
            token1: v.assets?.[1] || null,
            apr,
            tvl,
            risk: type === 'stable' ? 'low' : type === 'lp' ? 'medium' : 'low',
            tags: this.getBeefyTags(v, type),
            address: v.earnedTokenAddress,
            vaultId: v.id,
            minDeposit: 10,
            volume24h: this.estimateVolume(tvl)
          };
        })
        .filter(v => v.apr >= minApr)
        .sort((a, b) => b.apr - a.apr)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching Beefy yields:', error);
      return []; // Return empty array on error
    }
  }

  getBeefyTags(vault, type) {
    const tags = [];

    if (vault.strategyTypeId?.includes('lp')) tags.push('LP Token');
    if (vault.strategyTypeId?.includes('single')) tags.push('Single Asset');
    if (vault.status === 'active') tags.push('Active');
    if (type === 'stable') tags.push('Stable Coin');

    return tags;
  }

  estimateVolume(tvl) {
    // Estimasi volume 24h berdasarkan TVL
    return tvl * (Math.random() * 0.3 + 0.1); // 10-40% dari TVL
  }
}

export const yieldService = new YieldService();
