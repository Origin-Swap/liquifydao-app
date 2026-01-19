/**
 * Format number with thousand separators
 * 1234567.89 → 1,234,567.89
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0';

  const num = Number(value);
  if (Number.isNaN(num)) return '0';

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

/**
 * Format APY value
 * 12.3456 → 12.35%
 */
export const formatAPY = (apy) => {
  if (apy === null || apy === undefined) return '0%';

  const num = Number(apy);
  if (Number.isNaN(num)) return '0%';

  return `${num.toFixed(2)}%`;
};

/**
 * Shorten wallet address
 * 0x1234...abcd
 */
export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Simple USD formatter
 */
export const formatUSD = (value) => {
  if (value === null || value === undefined) return '$0';

  const num = Number(value);
  if (Number.isNaN(num)) return '$0';

  return `$${formatNumber(num, 2)}`;
};

/**
 * Calculate daily yield
 * amount * apy / 365
 */
export const calculateDailyYield = (amount, apy) => {
  const a = Number(amount);
  const r = Number(apy);

  if (Number.isNaN(a) || Number.isNaN(r)) return 0;

  return (a * r) / 100 / 365;
};

/**
 * Detect asset category
 * Used for yield optimization logic
 */
export const detectAssetType = (symbol) => {
  const stableCoins = ['USDT', 'USDC', 'DAI', 'BUSD'];

  if (stableCoins.includes(symbol)) return 'stable';

  return 'single';
};
