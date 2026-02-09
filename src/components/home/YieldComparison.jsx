import { useEffect, useState } from 'react';
import { AssetCard } from './AssetCard';
import { BeefyService } from '../../services/beefyService';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'lp', label: 'LP' },
  { key: 'single', label: 'Single' }
];

const PROTOCOLS = [
  { key: 'all', label: 'All Protocols' },
  { key: 'Beefy Finance', label: 'Beefy Finance' },
  { key: 'PancakeSwap', label: 'PancakeSwap' }
];

const beefy = new BeefyService();

export const YieldComparison = ({
  selectedAsset,
  onSelectAsset,
  onStakeClick
}) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [protocol, setProtocol] = useState('all');

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const data = await beefy.getYieldRates({
        chain: 'bsc',
        minTvl: 0,        // ← jangan bunuh data dulu
        limit: 20
      });

      if (mounted) {
        setAssets(data);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = assets.filter(asset => {
    const byType =
      activeTab === 'all' || asset.type === activeTab;

    const byProtocol =
      protocol === 'all' || asset.protocol === protocol;

    return byType && byProtocol;
  });

  useEffect(() => {
    console.log('assets length:', assets.length);
    console.log('sample:', assets[0]);
  }, [assets]);


  return (
    <div className="space-y-6">

      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* TABS */}
        <div className="flex gap-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition
                ${activeTab === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROTOCOL FILTER */}
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
          className="
            bg-gray-900 border border-gray-700 text-sm text-white
            rounded-lg px-3 py-2 outline-none
            focus:ring-2 focus:ring-purple-500
          "
        >
          {PROTOCOLS.map(p => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 text-sm">
          Loading Beefy vaults…
        </p>
      )}

      {/* POOLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(asset => (
          <AssetCard
            key={asset.address}
            asset={asset}
            isSelected={selectedAsset?.address === asset.address}
            onSelect={onSelectAsset}
            onStake={onStakeClick}
            onUnstake={() => {}}
            hasStake={false}
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          No pools available for this selection.
        </p>
      )}
    </div>
  );
};
