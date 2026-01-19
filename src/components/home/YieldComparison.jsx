import { useEffect, useState } from 'react';
import { AssetCard } from './AssetCard';
import { mockYields } from '../../mock/mockYields';

const TABS = [
  { key: 'stable', label: 'Stable Only' },
  { key: 'lp', label: 'LP' },
  { key: 'single', label: 'Single' }
];

const PROTOCOLS = [
  { key: 'all', label: 'All Protocols' },
  { key: 'PancakeSwap', label: 'PancakeSwap' },
  { key: 'Beefy Finance', label: 'Beefy Finance' }
];

export const YieldComparison = ({
  selectedAsset,
  onSelectAsset,
  onStakeClick
}) => {
  const [activeTab, setActiveTab] = useState('stable');
  const [protocol, setProtocol] = useState('all');
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setAssets(mockYields);
  }, []);

  const filtered = assets.filter(asset => {
    const byType = asset.type === activeTab;
    const byProtocol =
      protocol === 'all' || asset.protocol === protocol;
    return byType && byProtocol;
  });

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

        {/* PROTOCOL DROPDOWN */}
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
          className="
            bg-gray-900 border border-gray-700 text-sm text-white
            rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500
          "
        >
          {PROTOCOLS.map(p => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

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
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          No pools available for this selection.
        </p>
      )}
    </div>
  );
};
