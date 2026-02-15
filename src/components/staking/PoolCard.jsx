import AnimatedCounter from "./AnimatedCounter";
import StakeForm from "./StakeForm";
import ClaimSection from "./ClaimSection";
import { formatUnits } from "viem";
import {
  STAKING_ABI
} from "../../config/contracts";


import { useAccount, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";

export default function PoolCore({
  title,
  rewardToken,
  stakeToken,
  gradient,
  contractAddress,
  isGenesis
}) {
  const publicClient = usePublicClient();

  const [tvl, setTvl] = useState(0);
  const [apr, setApr] = useState(0);
  const [stakers, setStakers] = useState(0);

  const abi = isGenesis
    ? GENESIS_STAKING_ABI
    : NORMAL_STAKING_ABI;

  // Tentukan decimals untuk stake token
  const stakeDecimals = 18; // LIQ selalu 18 decimals
  const rewardDecimals = rewardToken === "USDT" ? 6 : 18;

  useEffect(() => {
    if (!publicClient) return;

    async function load() {
      try {
        console.log("Loading data for:", contractAddress, "isGenesis:", isGenesis);

        const [tvlRaw, stakersRaw, aprRaw] = await Promise.all([
          publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "totalStaked"
          }),
          publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "totalStakers"
          }),
          publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "currentAPR"
          })
        ]);

        console.log("Raw data:", { tvlRaw: tvlRaw.toString(), stakersRaw: stakersRaw.toString(), aprRaw: aprRaw.toString() });

        // TVL selalu pakai decimals stake token (LIQ = 18)
        setTvl(Number(formatUnits(tvlRaw, stakeDecimals)));
        setStakers(Number(stakersRaw));
        setApr(Number(aprRaw) / 100);

        console.log("Formatted:", { tvl: Number(formatUnits(tvlRaw, stakeDecimals)), stakers: Number(stakersRaw), apr: Number(aprRaw) / 100 });
      } catch (error) {
        console.error("Error loading pool data:", error);
      }
    }

    load();
  }, [publicClient, contractAddress, abi, stakeDecimals]);


  return (
    <div className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">

      <div className={`absolute inset-0 opacity-20 blur-3xl bg-gradient-to-r ${gradient}`} />

      <div className="relative z-10">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-400 text-sm">Flexible staking</p>
          </div>

          <div className={`px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${gradient} shadow-lg shadow-yellow-500/30 animate-pulse`}>
          {liveApy > 0
            ? `${liveApy.toFixed(2)}%`
            : "--"} APY
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Value Locked</p>
            <AnimatedCounter value={tvl.toFixed(4)} prefix="$" />
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Total Stakers</p>
            <AnimatedCounter value={stakers} />
          </div>
        </div>

        <StakeForm
          token={token}
          contractAddress={contractAddress}
          isNative={isNative}
          usdtAddress="0xUSDT_TOKEN"
        />

        <ClaimSection contractAddress={contractAddress} />
      </div>
    </div>
  );
}
