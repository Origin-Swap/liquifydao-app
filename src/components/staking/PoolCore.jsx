import { useEffect, useState } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { formatUnits } from "viem";
import AnimatedCounter from "./AnimatedCounter";
import StakeFormNormal from "./StakeFormNormal";
import StakeFormGenesis from "./StakeFormGenesis";
import WithdrawFormNormal from "./WithdrawFormNormal";
import WithdrawFormGenesis from "./WithdrawFormGenesis";
import ClaimSection from "./ClaimSection";
import {
  NORMAL_STAKING_ABI,
  GENESIS_STAKING_ABI
} from "../../config/contracts";

export default function PoolCore({
  title,
  rewardToken,
  stakeToken,
  gradient,
  contractAddress,
  isGenesis
}) {
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();

  const [tvl, setTvl] = useState(0);
  const [apr, setApr] = useState(0);
  const [stakers, setStakers] = useState(0);
  const [userStaked, setUserStaked] = useState("0");
  const [activeTab, setActiveTab] = useState("stake");

  const abi = isGenesis
    ? GENESIS_STAKING_ABI
    : NORMAL_STAKING_ABI;

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

      const stakedAmount = userInfo[0];
      const formattedStaked = formatUnits(stakedAmount, 18);
      setUserStaked(formattedStaked);

      console.log("User staked:", formattedStaked, "LIQ");
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserStaked("0");
    }
  };

  const refreshData = () => {
    load();
    loadUserData();
  };

  useEffect(() => {
    if (!publicClient) return;

    async function load() {
      try {
        if (isGenesis) {
          const [tvlRaw, stakersRaw, aprRaw] = await Promise.all([
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
              functionName: "APR"
            })
          ]);

          setTvl(Number(formatUnits(tvlRaw, 18)));
          setStakers(Number(stakersRaw));
          setApr(Number(aprRaw) / 100);

        } else {
          const [tvlRaw, stakersRaw, aprRaw] = await Promise.all([
            publicClient.readContract({
              address: contractAddress,
              abi: NORMAL_STAKING_ABI,
              functionName: "totalStaked"
            }),
            publicClient.readContract({
              address: contractAddress,
              abi: NORMAL_STAKING_ABI,
              functionName: "totalStakers"
            }),
            publicClient.readContract({
              address: contractAddress,
              abi: NORMAL_STAKING_ABI,
              functionName: "currentAPR"
            })
          ]);

          setTvl(Number(formatUnits(tvlRaw, 18)));
          setStakers(Number(stakersRaw));
          setApr(Number(aprRaw) / 100);
        }
      } catch (error) {
        console.error("Error loading pool data:", error);
      }
    }

    load();
    if (address) {
      loadUserData();
    }
  }, [publicClient, contractAddress, isGenesis, address]);

  return (
    <div className="bg-white/5 rounded-3xl md:px-8 py-4 px-4 border border-white/10">
      {/* Title dengan UPCOMING label */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>

        {/* UPCOMING Label - Muncul untuk kedua pool */}
        <div className="flex items-center">
          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-semibold text-yellow-400 animate-pulse">
            🚀 UPCOMING
          </span>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8">
          <img
            src={`/tokens/${stakeToken.toLowerCase()}.png`}
            className="w-8 h-8 rounded-full"
          />

          <img
            src={`/tokens/${rewardToken.toLowerCase()}.png`}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#0f172a]"
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
          <p className="text-gray-400 text-xs">Total staked</p>
          <p className="flex items-center gap-x-1 text-gray-200 text-xs">
          <AnimatedCounter value={tvl} />
          LIQ
          </p>
        </div>

        {/* Conditional rendering untuk kolom kedua */}
        {isGenesis ? (
          // Untuk Genesis Pool - Tampilkan Lock Period
          <div>
            <p className="text-gray-400 text-xs">Lock Period</p>
            <p className="text-2xl font-bold text-yellow-400">7 Days</p>
          </div>
        ) : (
          // Untuk Normal Pool - Tampilkan Stakers
          <div>
            <p className="text-gray-400 text-xs">Stakers</p>
            <AnimatedCounter value={stakers} />
          </div>
        )}
      </div>

      {/* Tab Navigation untuk Stake/Withdraw */}
      <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("stake")}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === "stake"
              ? isGenesis
                ? "bg-yellow-600 text-white"
                : "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Stake
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === "withdraw"
              ? isGenesis
                ? "bg-yellow-600 text-white"
                : "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Render based on active tab */}
      {activeTab === "stake" ? (
        isGenesis ? (
          <StakeFormGenesis
            contractAddress={contractAddress}
            onStakeSuccess={refreshData}
          />
        ) : (
          <StakeFormNormal
            contractAddress={contractAddress}
            onStakeSuccess={refreshData}
          />
        )
      ) : (
        isGenesis ? (
          <WithdrawFormGenesis
            contractAddress={contractAddress}
            onWithdrawSuccess={refreshData}
          />
        ) : (
          <WithdrawFormNormal
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
          isGenesis={isGenesis}
        />
      ) : (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">
            {isConnected
              ? "You haven't staked any tokens yet. Stake to earn rewards!"
              : "Connect your wallet to start staking"}
          </p>
        </div>
      )}
    </div>
  );
}
