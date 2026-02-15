import PoolCore from "./PoolCore";

export default function NormalPoolCard({ contractAddress }) {
  return (
    <PoolCore
      title="Normal Pool"
      rewardToken="LIQ"
      stakeToken="LIQ"
      gradient="from-indigo-400 to-purple-500"
      contractAddress={contractAddress}
      isGenesis={false}
    />
  );
}
