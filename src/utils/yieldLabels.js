export const getYieldLabels = (pool) => {
  const labels = [];

  if (pool.type === 'stable') {
    labels.push({ text: 'Low Risk', color: 'bg-green-500/20 text-green-400' });
  }

  if (pool.type === 'lp') {
    labels.push({ text: 'IL Risk', color: 'bg-yellow-500/20 text-yellow-400' });
  }

  if (pool.protocol === 'Beefy Finance') {
    labels.push({ text: 'Auto-compound', color: 'bg-purple-500/20 text-purple-400' });
  }

  return labels;
};
