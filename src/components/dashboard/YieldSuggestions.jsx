import { SectionCard } from '../common/SectionCard';
import { useWalletAssets } from './hooks/useWalletAssets';
import { formatAPY } from '../../utils/helpers';

export const YieldSuggestions = () => {
  const assets = useWalletAssets();

  const suggestions = [];

  assets.forEach(asset => {
    if (asset.type === 'stable') {
      suggestions.push({
        pool: 'USDC / USDT',
        protocol: 'Beefy Finance',
        apy: 12.4,
        reason: `You hold ${asset.symbol}`
      });
    }

    if (asset.symbol === 'BNB') {
      suggestions.push({
        pool: 'BNB / USDT',
        protocol: 'PancakeSwap',
        apy: 28.1,
        reason: 'You hold BNB'
      });
    }
  });

  if (suggestions.length === 0) {
    return (
      <SectionCard title="Yield Suggestions">
        <p className="text-gray-500 text-sm">
          No yield suggestions available
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Yield Suggestions">
      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-white font-medium">{s.pool}</p>
                <p className="text-gray-400 text-xs">{s.protocol}</p>
              </div>
              <span className="text-green-400 font-bold">
                {formatAPY(s.apy)}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {s.reason}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
