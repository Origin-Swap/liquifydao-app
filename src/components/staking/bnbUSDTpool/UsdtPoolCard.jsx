import PoolCore from "./PoolCore";

export default function UsdtPoolCard({ contractAddress }) {
  return (
    <PoolCore
      title="USDT Staking Pool"
      rewardToken="LIQ"
      stakeToken="USDT"
      gradient="from-green-500 to-emerald-500"
      contractAddress={contractAddress}
      poolType="usdt"
    />
  );
}
