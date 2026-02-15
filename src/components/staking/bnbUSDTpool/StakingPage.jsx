import BnbPoolCard from "./BnbPoolCard";
import UsdtPoolCard from "./UsdtPoolCard";
import {
  BNB_STAKING_ADDRESS,
  USDT_STAKING_ADDRESS
} from "../../../config/contracts2";

export const StakingBNBUSDTPage = () => {
  return (
    <div>

        <div className="grid md:grid-cols-2 gap-8">
          <BnbPoolCard contractAddress={BNB_STAKING_ADDRESS} />
          <UsdtPoolCard contractAddress={USDT_STAKING_ADDRESS} />
        </div>
    </div>
  );
};
