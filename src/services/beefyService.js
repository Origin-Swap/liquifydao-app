import axios from 'axios';

const BASE_URL = 'https://api.beefy.finance';

export class BeefyService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 15_000
    });
  }

  /* =========================
   * RAW FETCHERS
   * ========================= */

   async fetchVaults() {
     const { data } = await this.client.get('/vaults');

     // Beefy kadang return array, kadang object per chain
     if (Array.isArray(data)) return data;

     if (typeof data === 'object') {
       return Object.values(data).flat();
     }

     return [];
   }


  async fetchApy() {
    const { data } = await this.client.get('/apy');
    return data;
  }

  async fetchTvl() {
    const { data } = await this.client.get('/tvl');
    return data;
  }

  async fetchLpBreakdown() {
    const { data } = await this.client.get('/lps/breakdown');
    return data || {};
  }

  resolveLpTvl(vault, lpBreakdown) {
    if (vault.oracle !== 'lps') return 0;

    const lp = lpBreakdown[vault.oracleId];
    if (!lp) return 0;

    const price = Number(lp.price);
    const supply = Number(lp.totalSupply);

    if (!price || !supply) return 0;

    return price * supply;
  }


  /* =========================
   * NORMALIZER
   * ========================= */

   normalizeVault(vault, apyMap, tvlMap) {
     const apy = apyMap[vault.id];

     const tvl =
       vault.oracleId && tvlMap[vault.oracleId]
         ? tvlMap[vault.oracleId]
         : 0;

     return {
       protocol: 'Beefy Finance',

       pool: vault.name,
       chain: vault.chain || vault.network,
       type: this.detectType(vault),

       token0: vault.assets?.[0] || 'TOKEN',
       token1: vault.assets?.[1] || '',

       apr: apy ? apy * 100 : 0,
       tvl,

       address: vault.earnedTokenAddress,
       vaultId: vault.id,

       status: vault.status,
       strategyType: vault.strategyTypeId,
       risks: vault.risks || []
     };
   }

  detectType(vault) {
    if (!vault.strategyTypeId) return 'single';

    if (vault.strategyTypeId.includes('lp')) return 'lp';
    if (vault.strategyTypeId.includes('single')) return 'single';

    // fallback
    return vault.assets?.length > 1 ? 'lp' : 'single';
  }

  /* =========================
   * PUBLIC API
   * ========================= */

   async getYieldRates({
     chain,
     minApr = 10,   // 👈 default: hanya >= 20%
     limit = 20
   } = {}) {
     try {
       const [vaults, apyMap, lpBreakdown] = await Promise.all([
         this.fetchVaults(),
         this.fetchApy(),
         this.fetchLpBreakdown()
       ]);

       return vaults
         .filter(v =>
           !chain ||
           v.chain === chain ||
           v.network === chain
         )
         .filter(v => v.status !== 'eol')

         .map(v => {
           const apr =
             typeof apyMap[v.id] === 'number'
               ? apyMap[v.id] * 100
               : 0;

           const tvl = this.resolveLpTvl(v, lpBreakdown);

           return {
             protocol: 'Beefy Finance',
             pool: v.name,
             chain: v.chain || v.network,
             type: v.strategyTypeId?.includes('lp') ? 'lp' : 'single',
             token0: v.assets?.[0] || 'TOKEN',
             token1: v.assets?.[1] || '',
             apr,
             tvl,
             address: v.earnedTokenAddress,
             vaultId: v.id
           };
         })

         // ✅ FILTER UTAMA (INI INTINYA)
         .filter(v => v.apr >= minApr)

         // ✅ urutkan dari yang paling juicy
         .sort((a, b) => b.apr - a.apr)

         .slice(0, limit);

     } catch (e) {
       console.error('[BeefyService]', e);
       return [];
     }
   }

}
