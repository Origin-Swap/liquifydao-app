import { SectionCard } from '../common/SectionCard';
import { useWalletAssets } from './hooks/useWalletAssets';
import { formatNumber } from '../../utils/helpers';

export const WalletAssets = () => {
  const assets = useWalletAssets();

  return (
    <SectionCard title="Your Assets">
      {assets.length === 0 && (
        <p className="text-gray-500 text-sm">
          No assets detected in this wallet
        </p>
      )}

      <div className="space-y-3">
        {assets.map(asset => (
          <div
            key={asset.symbol}
            className="flex justify-between text-sm"
          >
            <span className="text-white font-medium">
              {asset.symbol}
            </span>
            <span className="text-green-400 font-semibold">
              {formatNumber(asset.balance)}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
