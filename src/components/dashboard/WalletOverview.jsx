import { SectionCard } from '../common/SectionCard';
import { formatNumber, shortenAddress } from '../../utils/helpers';

export const WalletOverview = ({ address, chain, balance, assets }) => {
  // Hitung total value dan distribusi
  const totalValue = assets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;
  const assetCount = assets?.length || 0;

  return (
    <SectionCard title="Wallet Overview" className="bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="space-y-4">
        {/* Main Info dengan icon */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Connected Wallet</p>
            <p className="text-white font-mono text-sm">{shortenAddress(address, 6)}</p>
          </div>
        </div>

        {/* Network Badge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Network</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white font-medium">{chain}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Total Value</p>
            <p className="text-lg font-bold text-white">${formatNumber(totalValue)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Assets</p>
            <p className="text-lg font-bold text-white">{assetCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 rounded-lg transition-colors">
            Deposit
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg transition-colors">
            Withdraw
          </button>
        </div>
      </div>
    </SectionCard>
  );
};
