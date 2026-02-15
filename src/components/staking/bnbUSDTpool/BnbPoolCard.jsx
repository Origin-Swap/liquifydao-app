import PoolCore from "./PoolCore";

export default function BnbPoolCard({ contractAddress }) {
  return (
    <PoolCore
      title="BNB Staking Pool"
      rewardToken="LIQ"
      stakeToken="BNB"
      gradient="from-yellow-500 to-orange-500"
      contractAddress={contractAddress}
      poolType="bnb"
    />
  );
}
