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
      return [];
    }
  }

  async getYieldRates() {
    try {
      const farms = await this.getFarms();
      return farms.map(farm => ({
        protocol: 'PancakeSwap',
        pool: farm.pair,
        token0: farm.token0.symbol,
        token1: farm.token1.symbol,
        apr: parseFloat(farm.apr),
        tvl: parseFloat(farm.tvlUsd),
        address: farm.pairAddress
      }));
    } catch (error) {
      console.error('Error getting yield rates:', error);
      return [];
    }
  }
}
