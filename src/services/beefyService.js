import axios from 'axios';

const BEEFY_VAULTS =
  'https://raw.githubusercontent.com/beefyfinance/beefy-v2/main/src/config/vaults.json';

export class BeefyService {
  async getYieldRates() {
    try {
      const res = await axios.get(BEEFY_VAULTS);
      return res.data.slice(0, 10).map(vault => ({
        protocol: 'Beefy Finance',
        pool: vault.name,
        token0: vault.assets?.[0] || 'TOKEN',
        token1: vault.assets?.[1] || '',
        apr: Number(vault.apy || 0),
        tvl: Number(vault.tvl || 0),
        address: vault.earnedTokenAddress || vault.id
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
