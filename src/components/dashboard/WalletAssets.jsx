import { SectionCard } from '../common/SectionCard';
import { useWalletAssets } from './hooks/useWalletAssets';
import { formatNumber } from '../../utils/helpers';
import { useState } from 'react';

const TokenIcon = ({ symbol }) => {
  const icons = {
    BNB: '🟡',
    USDT: '💵',
    USDC: '💵',
    LIQ: '💧',
    default: '🪙'
  };

  // Perbaikan di sini: ganti ] dengan }
  return <span className="mr-2">{icons[symbol] || icons.default}</span>;
};

export const WalletAssets = () => {
  const assets = useWalletAssets();
  const [showAll, setShowAll] = useState(false);

  // Hitung total value
  const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);

  // Tampilkan semua atau hanya yang balance > 0
  const displayedAssets = showAll ? assets : assets.filter(a => a.balance > 0);

  return (
    <SectionCard title="Your Assets" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💼</div>
          <p className="text-gray-400 text-sm">No assets detected</p>
          <p className="text-gray-600 text-xs mt-1">Deposit funds to start earning yield</p>
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {/* Total Portfolio */}
          <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-400">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-white">${formatNumber(totalValue)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {assets.length} asset{assets.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Toggle show zero balances */}
          {assets.some(a => a.balance === 0) && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-purple-400 hover:text-purple-300 mb-2"
            >
              {showAll ? 'Hide' : 'Show'} zero balances
            </button>
          )}

          {/* Asset List */}
          {displayedAssets.map(asset => {
            const percentage = totalValue > 0 ? ((asset.value || 0) / totalValue * 100) : 0;

            return (
              <div
                key={asset.symbol}
                className="group hover:bg-gray-800/50 rounded-lg p-2 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TokenIcon symbol={asset.symbol} />
                    <div>
                      <span className="text-white font-medium">
                        {asset.symbol}
                      </span>
                      <p className="text-xs text-gray-500">
                        {asset.type === 'stable' ? 'Stable Coin' : 'Token'}
                        {asset.price && (
                          <span className="ml-2 text-purple-400">
                            ${formatNumber(asset.price, 4)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold block ${asset.balance > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      {formatNumber(asset.balance)}
                    </span>
                    {asset.value > 0 ? (
                      <span className="text-xs text-gray-400">
                        ${formatNumber(asset.value)}
                      </span>
                    ) : asset.balance === 0 ? (
                      <span className="text-xs text-gray-600">
                        No balance
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Progress bar */}
                {totalValue > 0 && asset.value > 0 && (
                  <div className="mt-2 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};
