import { useEffect, useState } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { formatUnits } from "viem";
import AnimatedCounter from "./../AnimatedCounter";
import StakeFormBnb from "./StakeFormBnb";
import StakeFormUsdt from "./StakeFormUsdt";
import WithdrawFormBnb from "./WithdrawFormBnb";
import WithdrawFormUsdt from "./WithdrawFormUsdt";
import ClaimSection from "./ClaimSection";
import {
  BNB_STAKING_ABI,
  USDT_STAKING_ABI
} from "../../../config/contracts2";

export default function PoolCore({
  title,
  rewardToken,
  stakeToken,
  gradient,
  contractAddress,
  poolType // "bnb" or "usdt"
}) {
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();

  const [tvl, setTvl] = useState(0);
  const [apr, setApr] = useState(0);
  const [stakers, setStakers] = useState(0);
  const [userStaked, setUserStaked] = useState("0");
  const [activeTab, setActiveTab] = useState("stake");

  const abi = poolType === "bnb" ? BNB_STAKING_ABI : USDT_STAKING_ABI;
  const stakeDecimals = poolType === "bnb" ? 18 : 6; // BNB = 18, USDT = 6

  // Fungsi untuk load data pool
  const loadPoolData = async () => {
    if (!publicClient) return;

    try {
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

      setTvl(Number(formatUnits(tvlRaw, stakeDecimals)));
      setStakers(Number(stakersRaw));
      setApr(Number(aprRaw) / 100); // APR dalam basis points (800 / 100 = 8%)

      console.log(`${poolType.toUpperCase()} Pool Data:`, {
        tvl: Number(formatUnits(tvlRaw, stakeDecimals)),
        stakers: Number(stakersRaw),
        apr: Number(aprRaw) / 100,
        aprRaw: aprRaw.toString()
      });

    } catch (error) {
      console.error("Error loading pool data:", error);
    }
  };

  // Fungsi untuk load data user
  const loadUserData = async () => {
    if (!address || !publicClient) return;

    try {
      const userInfo = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "userInfo",
        args: [address]
      });

      const stakedAmount = userInfo[0]; // amount di index 0
      const formattedStaked = formatUnits(stakedAmount, stakeDecimals);
      setUserStaked(formattedStaked);

      console.log("User staked:", formattedStaked, stakeToken);
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserStaked("0");
    }
  };

  // Fungsi refresh data
  const refreshData = () => {
    loadPoolData();
    loadUserData();
  };

  // Load data saat pertama render dan dependencies berubah
  useEffect(() => {
    loadPoolData();
    if (address) {
      loadUserData();
    }
  }, [publicClient, contractAddress, poolType, address, stakeDecimals]);

  return (
    <div className="bg-white/5 rounded-3xl md:px-8 py-4 px-4 border border-white/10">
      {/* Title dengan LIVE label */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title} (Flexible)</h2>

        {/* LIVE Label */}
        <div className="flex items-center">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-semibold text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <img
              src={`/tokens/${stakeToken.toLowerCase()}.png`}
              className="w-8 h-8 rounded-full"
              alt={stakeToken}
            />
            <img
              src={`/tokens/${rewardToken.toLowerCase()}.png`}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#0f172a]"
              alt={rewardToken}
            />
          </div>

          <p className="text-gray-400 text-sm">
            {stakeToken} / {rewardToken}
          </p>
        </div>

        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradient}`}>
          {apr.toFixed(2)}% APR
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-400 text-xs">TVL</p>
          <p className="flex items-center gap-x-1 text-gray-200 text-xs">
            <AnimatedCounter value={tvl} />
            {stakeToken}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Stakers</p>
          <AnimatedCounter value={stakers} />
        </div>
      </div>

      {/* Tab Navigation untuk Stake/Withdraw */}
      <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("stake")}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === "stake"
              ? poolType === "bnb"
                ? "bg-yellow-600 text-white"
                : "bg-green-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Stake
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === "withdraw"
              ? poolType === "bnb"
                ? "bg-yellow-600 text-white"
                : "bg-green-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Render based on active tab */}
      {activeTab === "stake" ? (
        poolType === "bnb" ? (
          <StakeFormBnb
            contractAddress={contractAddress}
            onStakeSuccess={refreshData}
          />
        ) : (
          <StakeFormUsdt
            contractAddress={contractAddress}
            onStakeSuccess={refreshData}
          />
        )
      ) : (
        poolType === "bnb" ? (
          <WithdrawFormBnb
            contractAddress={contractAddress}
            onWithdrawSuccess={refreshData}
          />
        ) : (
          <WithdrawFormUsdt
            contractAddress={contractAddress}
            onWithdrawSuccess={refreshData}
          />
        )
      )}

      {/* Claim Section - Hanya tampil jika user sudah stake */}
      {isConnected && parseFloat(userStaked) > 0 ? (
        <ClaimSection
          contractAddress={contractAddress}
          rewardToken={rewardToken}
          poolType={poolType}
        />
      ) : (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">
            {isConnected
              ? `You haven't staked any ${stakeToken} yet. Stake to earn ${rewardToken} rewards!`
              : "Connect your wallet to start staking"}
          </p>
        </div>
      )}
    </div>
  );
}
