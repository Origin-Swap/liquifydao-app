import { useAccount, useBalance } from 'wagmi';
import { WalletOverview } from '../components/dashboard/WalletOverview';
import { WalletAssets } from '../components/dashboard/WalletAssets';
import { AssetAllocation } from '../components/dashboard/AssetAllocation';
import { YieldSuggestions } from '../components/dashboard/YieldSuggestions';
import { bsc } from 'wagmi/chains';
import { useWalletAssets } from '../components/dashboard/hooks/useWalletAssets';

export const Dashboard = () => {
  const { address, isConnected, chain } = useAccount();
  const assets = useWalletAssets(); // <-- PASTIKAN INI ADA

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your portfolio and yield opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4  text-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Manage your assets and optimize yields</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* PASTIKAN assets DIKIRIM KE SINI */}
          <WalletOverview
            address={address}
            chain={chain?.name}
            assets={assets} // <-- INI PENTING!
          />
          <WalletAssets />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AssetAllocation assets={assets} />
          <YieldSuggestions />
        </div>
      </div>
    </div>
  );
};
