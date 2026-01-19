export const getRecommendedAmount = (balance, type) => {
  if (!balance) return 0;

  switch (type) {
    case 'stable': return balance * 0.5;
    case 'single': return balance * 0.3;
    case 'lp': return balance * 0.2;
    default: return 0;
  }
};
