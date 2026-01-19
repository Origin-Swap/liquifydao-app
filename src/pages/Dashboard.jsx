import { useAccount, useBalance } from 'wagmi';
import { WalletOverview } from '../components/dashboard/WalletOverview';
import { WalletAssets } from '../components/dashboard/WalletAssets';
import { AssetAllocation } from '../components/dashboard/AssetAllocation';
import { YieldSuggestions } from '../components/dashboard/YieldSuggestions';
import { bsc } from 'wagmi/chains';

export const Dashboard = () => {
  const { address, isConnected, chain } = useAccount();
  const { data } = useBalance({ address });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Connect your wallet to view dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WalletOverview
            address={address}
            chain={chain?.id === bsc.id ? 'BSC' : 'Unknown'}
            balance={data?.formatted || 0}
          />
          <AssetAllocation />
          <WalletAssets />
        </div>

        <YieldSuggestions />

      </div>
    </div>
  );
};
