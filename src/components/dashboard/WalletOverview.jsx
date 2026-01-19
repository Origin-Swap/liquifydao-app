import { SectionCard } from '../common/SectionCard';
import { formatNumber } from '../../utils/helpers';

export const WalletOverview = ({ address, chain, balance }) => {
  return (
    <SectionCard title="Wallet Overview">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Address</span>
          <span className="text-white truncate max-w-[140px]">
            {address}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Chain</span>
          <span className="text-white">{chain}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Balance</span>
          <span className="text-green-400 font-semibold">
            ${formatNumber(balance)}
          </span>
        </div>
      </div>
    </SectionCard>
  );
};
