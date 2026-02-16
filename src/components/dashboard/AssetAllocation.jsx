// AssetAllocation.jsx
import { SectionCard } from '../common/SectionCard';
import { useState } from 'react';
import { formatNumber } from '../../utils/helpers';

const calculateAllocation = (assets) => {
  const allocation = {
    Stable: { value: 0, color: 'from-blue-400 to-blue-600' },
    Single: { value: 0, color: 'from-purple-400 to-purple-600' },
    LP: { value: 0, color: 'from-pink-400 to-pink-600' }
  };

  assets.forEach(asset => {
    if (asset.type === 'stable') {
      allocation.Stable.value += asset.value || 0;
    } else if (asset.type === 'single') {
      allocation.Single.value += asset.value || 0;
    }
    // LP belum diimplementasi
  });

  const total = Object.values(allocation).reduce((sum, item) => sum + item.value, 0);

  return Object.entries(allocation).map(([label, data]) => ({
    label,
    value: data.value,
    percent: total > 0 ? (data.value / total) * 100 : 0,
    color: data.color
  })).filter(item => item.value > 0); // Hanya tampilkan yang punya value
};

export const AssetAllocation = ({ assets = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const allocation = calculateAllocation(assets);
  const total = allocation.reduce((sum, item) => sum + item.value, 0);

  // Buat gradient string untuk donut chart
  const getConicGradient = () => {
    if (allocation.length === 0) return 'conic-gradient(#2d2d2d 100%)';

    let gradient = 'conic-gradient(';
    let start = 0;

    allocation.forEach((item, i) => {
      const color = item.color.split(' ')[0].replace('from-', '');
      const colorMap = {
        'blue-400': '#60a5fa',
        'purple-400': '#c084fc',
        'pink-400': '#f472b6'
      };
      const hexColor = colorMap[color] || '#8b5cf6';

      const end = start + item.percent;
      gradient += `${hexColor} ${start}% ${end}%`;
      if (i < allocation.length - 1) gradient += ', ';
      start = end;
    });

    gradient += ')';
    return gradient;
  };

  return (
    <SectionCard title="Asset Allocation" className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-purple-500/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-purple-500/20 rounded-full"></div>
      </div>

      {total === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">No allocation data</p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {/* Donut Chart */}
          <div className="flex justify-center items-center py-4">
            <div className="relative w-32 h-32">
              <div
                className="w-full h-full rounded-full"
                style={{ background: getConicGradient() }}
              >
                <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation List */}
          <div className="space-y-3">
            {allocation.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} mr-2`} />
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{item.percent.toFixed(1)}%</span>
                    <span className="text-xs text-gray-500">
                      (${formatNumber(item.value)})
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 ease-out`}
                    style={{
                      width: `${item.percent}%`,
                      opacity: hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.5
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Allocated</span>
              <span className="text-white font-medium">${formatNumber(total)}</span>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
