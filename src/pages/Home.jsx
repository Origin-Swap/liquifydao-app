import { useState } from 'react';
import { YieldComparison } from '../components/home/YieldComparison';
import { StakingForm } from '../components/home/StakingForm';

export const Home = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [stakeTarget, setStakeTarget] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        <header>
          <h1 className="text-3xl font-bold">Earn Yield</h1>
          <p className="text-gray-400 text-sm">
            Choose a pool and stake when ready
          </p>
        </header>

        <YieldComparison
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          onStakeClick={setStakeTarget}
        />

        {/* ✅ MODAL GUARDED */}
        {stakeTarget && (
          <StakingForm
            asset={stakeTarget}
            onClose={() => setStakeTarget(null)}
          />
        )}

      </div>
    </div>
  );
};
