import { formatAPY, formatNumber } from '../../utils/helpers';
import { calculateYieldScore } from '../../utils/yieldScoring';
import { getYieldLabels } from '../../utils/yieldLabels';


export const AssetCard = ({
  asset,
  isSelected,
  onSelect,
  onStake,
  onUnstake,
  hasStake = false
}) => {
  const getProtocolColor = (protocol) => {
    switch (protocol) {
      case 'PancakeSwap': return 'text-blue-400';
      case 'Beefy Finance': return 'text-green-400';
      default: return 'text-purple-400';
    }
  };
  const score = calculateYieldScore(asset);
  const labels = getYieldLabels(asset);

  return (
    <div
      onClick={() => onSelect(asset)}
      className={`
        rounded-xl p-5 cursor-pointer transition-all
        bg-gray-900 border
        ${isSelected ? 'border-purple-500 ring-1 ring-purple-500/40' : 'border-gray-800 hover:border-gray-700'}
      `}
    >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {asset.token0[0]}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{asset.pool}</h3>
            <p className={`text-sm ${getProtocolColor(asset.protocol)}`}>
              {asset.protocol}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-green-400 font-bold text-lg">
            {formatAPY(asset.apr)}
          </p>
          <p className="text-xs text-gray-400">APY</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">TVL</span>
          <span className="text-white font-medium">
            ${formatNumber(asset.tvl)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tokens</span>
          <span className="text-white font-medium">
            {asset.token0}/{asset.token1}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Risk</span>
          <span className="text-yellow-400">Medium</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Yield Score</span>
          <span className="font-bold text-white">{score}/100</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {labels.map(label => (
            <span
              key={label.text}
              className={`text-xs px-2 py-1 rounded ${label.color}`}
            >
              {label.text}
            </span>
          ))}
        </div>                
      </div>

      {/* ACTIONS */}
      {isSelected && (
        <div className="mt-5 flex gap-3">
          {!hasStake ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStake(asset);
              }}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
            >
              Stake
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnstake(asset);
              }}
              className="flex-1 py-2 rounded-lg border border-red-500/40 text-red-400 font-semibold"
            >
              Unstake
            </button>
          )}
        </div>
      )}
    </div>
  );
};
