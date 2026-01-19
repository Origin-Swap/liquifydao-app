export const calculateYieldScore = (pool) => {
  let score = 0;

  // 1. APY (max 40)
  const apyScore = Math.min(pool.apr, 40);
  score += apyScore;

  // 2. Risk (max 30)
  if (pool.type === 'stable') score += 30;
  else if (pool.type === 'single') score += 20;
  else if (pool.type === 'lp') score += 10;

  // 3. Protocol trust (max 20)
  if (pool.protocol === 'Beefy Finance') score += 20;
  else if (pool.protocol === 'PancakeSwap') score += 15;

  // 4. TVL confidence (max 10)
  if (pool.tvl > 5_000_000) score += 10;
  else if (pool.tvl > 1_000_000) score += 6;
  else score += 3;

  return Math.min(Math.round(score), 100);
};
