import { useState } from 'react';
import { formatAPY, formatNumber } from '../../utils/helpers';
import { getRecommendedAmount } from '../../utils/recommendation';


export const StakingForm = ({ asset, onClose }) => {
  const [amount, setAmount] = useState('');

  const estimatedDaily =
    (Number(amount || 0) * asset.apr) / 100 / 365;

    const recommended = getRecommendedAmount(
      asset.walletBalance, // dari wallet tracking
      asset.type
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-gray-900 p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            Stake {asset.pool}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div>
          <p className="text-green-400 font-bold">
            {formatAPY(asset.apr)} APY
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Amount to stake
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-2 w-full rounded-lg bg-black border border-gray-700 px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <button
          onClick={() => setAmount(recommended.toFixed(4))}
          className="text-sm text-purple-400 hover:underline"
        >
          Use recommended amount ({recommended.toFixed(4)})
        </button>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estimated / day</span>
          <span className="text-green-400 font-medium">
            ${formatNumber(estimatedDaily.toFixed(4))}
          </span>
        </div>

        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
        >
          Confirm Stake
        </button>

      </div>
    </div>
  );
};
