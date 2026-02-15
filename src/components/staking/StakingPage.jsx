import NormalPoolCard from "./NormalPoolCard";
import GenesisPoolCard from "./GenesisPoolCard";
import {
  NORMAL_STAKING_ADDRESS,
  GENESIS_STAKING_ADDRESS
} from "../../config/contracts";

export const StakingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Liquify Staking</h1>
          <p className="text-gray-400 mt-2">
            Choose your pool and start earning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <NormalPoolCard contractAddress={NORMAL_STAKING_ADDRESS} />
          <GenesisPoolCard contractAddress={GENESIS_STAKING_ADDRESS} />
        </div>

      </div>
    </div>
  );
};
