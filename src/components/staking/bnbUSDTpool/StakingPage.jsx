import BnbPoolCard from "./BnbPoolCard";
import UsdtPoolCard from "./UsdtPoolCard";
import {
  BNB_STAKING_ADDRESS,
  USDT_STAKING_ADDRESS
} from "../../../config/contracts2";

export const StakingBNBUSDTPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white px-4 py-10">

        <div className="grid md:grid-cols-2 gap-8">
          <BnbPoolCard contractAddress={BNB_STAKING_ADDRESS} />
          <UsdtPoolCard contractAddress={USDT_STAKING_ADDRESS} />
        </div>
    </div>
  );
};
