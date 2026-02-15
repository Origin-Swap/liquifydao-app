import PoolCore from "./PoolCore";
import { useEffect } from "react";
import { usePublicClient } from "wagmi";
import { GENESIS_STAKING_ABI } from "../../config/contracts";

export default function GenesisPoolCard({ contractAddress }) {
  const publicClient = usePublicClient();

  // Debug: Cek langsung contract
  useEffect(() => {
    async function debug() {
      if (!publicClient || !contractAddress) return;

      try {
        console.log("=== DEBUG GENESIS POOL ===");
        console.log("Contract Address:", contractAddress);

        const [totalStaked, totalStakers, apr] = await Promise.all([
          publicClient.readContract({
            address: contractAddress,
            abi: GENESIS_STAKING_ABI,
            functionName: "totalStaked"
          }),
          publicClient.readContract({
            address: contractAddress,
            abi: GENESIS_STAKING_ABI,
            functionName: "totalStakers"
          }),
          publicClient.readContract({
            address: contractAddress,
            abi: GENESIS_STAKING_ABI,
            functionName: "currentAPR"
          })
        ]);

        console.log("totalStaked (raw):", totalStaked.toString());
        console.log("totalStakers (raw):", totalStakers.toString());
        console.log("APR (raw):", apr.toString());
        console.log("==========================");
      } catch (error) {
        console.error("Debug error:", error);
      }
    }

    debug();
  }, [publicClient, contractAddress]);

  return (
    <PoolCore
      title="Genesis Pool (7 days)"
      rewardToken="USDT"
      stakeToken="LIQ"
      gradient="from-yellow-400 to-orange-500"
      contractAddress={contractAddress}
      isGenesis={true}
    />
  );
}
