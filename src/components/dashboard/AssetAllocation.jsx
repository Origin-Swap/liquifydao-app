import { SectionCard } from '../common/SectionCard';

const allocation = [
  { label: 'Stable', percent: 40 },
  { label: 'Single', percent: 45 },
  { label: 'LP', percent: 15 }
];

export const AssetAllocation = () => {
  return (
    <SectionCard title="Asset Allocation">
      <div className="space-y-3">
        {allocation.map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.percent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
