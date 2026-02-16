// YieldSuggestions.jsx
import { SectionCard } from '../common/SectionCard';
import { useYields } from './hooks/useYields';
import { formatAPY, formatNumber } from '../../utils/helpers';
import { useState, useMemo } from 'react';

const riskColors = {
  low: 'text-green-400 bg-green-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  high: 'text-red-400 bg-red-500/10'
};

const typeIcons = {
  stable: '💵',
  single: '🪙',
  lp: '💧'
};

export const YieldSuggestions = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, stable, single, lp
  const [sortBy, setSortBy] = useState('relevance'); // relevance, apr, tvl

  const { yields, loading, error } = useYields({
    chain: 'bsc',
    minApr: 5,
    limit: 30
  });

  // Filter dan sort yields - gunakan useMemo untuk menghindari re-render tidak perlu
  const filteredYields = useMemo(() => {
    // Pastikan yields adalah array
    const yieldsArray = Array.isArray(yields) ? yields : [];

    let filtered = yieldsArray;

    // Apply filter type
    if (filterType !== 'all') {
      filtered = filtered.filter(y => y.type === filterType);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'apr') return (b.apr || 0) - (a.apr || 0);
      if (sortBy === 'tvl') return (b.tvl || 0) - (a.tvl || 0);
      // relevance
      return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    });

    return filtered;
  }, [yields, filterType, sortBy]);

  // Stats - pastikan tidak NaN
  const avgApy = useMemo(() => {
    if (filteredYields.length === 0) return 0;
    const sum = filteredYields.reduce((sum, y) => sum + (y.apr || 0), 0);
    return sum / filteredYields.length;
  }, [filteredYields]);

  const totalTvl = useMemo(() => {
    return filteredYields.reduce((sum, y) => sum + (y.tvl || 0), 0);
  }, [filteredYields]);

  if (loading) {
    return (
      <SectionCard title="Yield Suggestions">
        <div className="text-center py-8">
          <div className="animate-spin text-4xl mb-3">🌾</div>
          <p className="text-gray-400 text-sm">Loading yield opportunities...</p>
        </div>
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard title="Yield Suggestions">
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-gray-400 text-sm">Failed to load yields</p>
          <p className="text-gray-600 text-xs mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
          >
            Try again
          </button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Yield Suggestions" className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 border border-purple-500/20 rounded-full"></div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">Avg. APY</p>
            <p className="text-lg font-bold text-purple-400">
              {formatAPY(avgApy)}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400">Total TVL</p>
            <p className="text-lg font-bold text-white">
              ${formatNumber(totalTvl / 1e6)}M
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filterType === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All ({yields.length})
          </button>
          <button
            onClick={() => setFilterType('stable')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filterType === 'stable'
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Stable ({yields.filter(y => y.type === 'stable').length})
          </button>
          <button
            onClick={() => setFilterType('single')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filterType === 'single'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Single ({yields.filter(y => y.type === 'single').length})
          </button>
          <button
            onClick={() => setFilterType('lp')}
            className={`px-3 py-1 rounded-full transition-colors ${
              filterType === 'lp'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            LP ({yields.filter(y => y.type === 'lp').length})
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex justify-end space-x-2 text-xs">
          <button
            onClick={() => setSortBy('relevance')}
            className={`px-2 py-1 rounded ${
              sortBy === 'relevance' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            Relevance
          </button>
          <button
            onClick={() => setSortBy('apr')}
            className={`px-2 py-1 rounded ${
              sortBy === 'apr' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            APR
          </button>
          <button
            onClick={() => setSortBy('tvl')}
            className={`px-2 py-1 rounded ${
              sortBy === 'tvl' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            TVL
          </button>
        </div>

        {/* Suggestions List */}
        {filteredYields.length === 0 ? (
          <div className="text-center py-6 bg-gray-800/30 rounded-lg">
            <p className="text-gray-400 text-sm">No {filterType} opportunities found</p>
            <button
              onClick={() => setFilterType('all')}
              className="mt-2 text-purple-400 hover:text-purple-300 text-xs"
            >
              View all opportunities
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredYields.map((y, i) => (
              <div
                key={y.id || i}
                className={`group border rounded-lg p-3 transition-all cursor-pointer
                  ${selectedPool === i
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/30'
                  }
                  ${y.relevanceScore > 0 ? 'border-l-4 border-l-purple-500' : ''}
                `}
                onClick={() => setSelectedPool(selectedPool === i ? null : i)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{y.protocolIcon || '🏦'}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-semibold text-sm">{y.pool}</p>
                        {y.relevanceScore > 0 && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
                            Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{y.protocol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">
                      {formatAPY(y.apr)}
                    </p>
                    <p className="text-xs text-gray-500">APR</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[y.risk] || 'bg-gray-700 text-gray-300'}`}>
                    {(y.risk || 'medium').toUpperCase()} RISK
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                    {typeIcons[y.type] || '🪙'} {(y.type || 'single').toUpperCase()}
                  </span>
                  {(y.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tokens & TVL */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">
                      {y.token0} {y.token1 && `/${y.token1}`}
                    </span>
                  </div>
                  <p className="text-gray-500">
                    TVL: ${formatNumber((y.tvl || 0) / 1e6)}M
                  </p>
                </div>

                {/* Reason */}
                {y.reason && (
                  <p className="text-xs text-purple-400 mt-2">
                    💡 {y.reason}
                  </p>
                )}

                {/* Expandable Details */}
                {selectedPool === i && (
                  <div className="mt-3 pt-3 border-t border-gray-700 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-gray-800 p-2 rounded">
                        <p className="text-gray-400">Min Deposit</p>
                        <p className="text-white">${y.minDeposit || 10}</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                        <p className="text-gray-400">24h Volume</p>
                        <p className="text-white">${formatNumber((y.volume24h || 0) / 1e3)}K</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-2 rounded-lg transition-colors">
                        Invest Now
                      </button>
                      <button className="px-3 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded-lg transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 pt-2">
          Data from Beefy Finance • Auto-refresh 5min
        </p>
      </div>
    </SectionCard>
  );
};
