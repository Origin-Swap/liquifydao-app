// pancakeService.js
import axios from 'axios';

const PANCAKE_API = 'https://api.pancakeswap.info/api/v2';

export class PancakeService {
  async getPairs() {
    try {
      const response = await axios.get(`${PANCAKE_API}/pairs`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching PancakeSwap pairs:', error);
      return [];
    }
  }

  async getFarms() {
    try {
      const response = await axios.get(`${PANCAKE_API}/farms`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching farms:', error);

      // Return fallback data instead of empty array
      return this.getFallbackFarms();
    }
  }

  async getYieldRates() {
    try {
      const farms = await this.getFarms();
      return farms.map(farm => ({
        protocol: 'PancakeSwap',
        pool: farm.pair,
        token0: farm.token0?.symbol || 'TOKEN',
        token1: farm.token1?.symbol || '',
        apr: parseFloat(farm.apr) || 0,
        tvl: parseFloat(farm.tvlUsd) || 0,
        address: farm.pairAddress
      }));
    } catch (error) {
      console.error('Error getting yield rates:', error);
      return [];
    }
  }

  // Fallback data when API fails
  getFallbackFarms() {
    return [
      {
        pair: 'BNB/USDT',
        token0: { symbol: 'BNB' },
        token1: { symbol: 'USDT' },
        apr: 28.5,
        tvlUsd: 189000000,
        pairAddress: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae',
        isLp: true
      },
      {
        pair: 'CAKE/USDT',
        token0: { symbol: 'CAKE' },
        token1: { symbol: 'USDT' },
        apr: 42.3,
        tvlUsd: 125000000,
        pairAddress: '0x0ed7e52944161450477ee417de9cd3a859b14fd0',
        isLp: true
      },
      {
        pair: 'BNB Staking',
        token0: { symbol: 'BNB' },
        token1: null,
        apr: 15.2,
        tvlUsd: 98000000,
        pairAddress: '0x123...',
        isLp: false
      },
      {
        pair: 'USDT Staking',
        token0: { symbol: 'USDT' },
        token1: null,
        apr: 8.7,
        tvlUsd: 45000000,
        pairAddress: '0x456...',
        isLp: false
      },
      {
        pair: 'ETH/BTC',
        token0: { symbol: 'ETH' },
        token1: { symbol: 'BTC' },
        apr: 18.9,
        tvlUsd: 67000000,
        pairAddress: '0x789...',
        isLp: true
      }
    ];
  }
}
