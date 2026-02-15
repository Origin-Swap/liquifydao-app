import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import {
  NORMAL_STAKING_ABI,
  GENESIS_STAKING_ABI
} from "../../config/contracts";

export default function ClaimSection({
  contractAddress,
  rewardToken,     // "LIQUIFY" or "USDT"
  isGenesis
}) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [pending, setPending] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [loading, setLoading] = useState(false);

  const rewardDecimals = rewardToken === "USDT" ? 6 : 18;
  const stakeDecimals = 18; // LIQ selalu 18 decimals
  const abi = isGenesis ? GENESIS_STAKING_ABI : NORMAL_STAKING_ABI;

  const loadUserData = async () => {
    if (!address || !publicClient) return;

    try {
      // Load pending reward
      const pendingResult = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "pendingReward",
        args: [address]
      });

      const formattedPending = formatUnits(pendingResult, rewardDecimals);
      setPending(formattedPending);

      // Load user's staked amount
      // Untuk Genesis Pool, gunakan userInfo
      // Untuk Normal Pool, mungkin ada function berbeda
      let stakedResult;

      if (isGenesis) {
        // Genesis Pool menggunakan userInfo mapping
        const userInfo = await publicClient.readContract({
          address: contractAddress,
          abi: GENESIS_STAKING_ABI,
          functionName: "userInfo",
          args: [address]
        });
        // userInfo biasanya mengembalikan tuple [amount, rewardStored, lastUpdate]
        stakedResult = userInfo[0]; // amount adalah index 0
      } else {
        // Normal Pool - asumsikan ada function stakedBalance atau serupa
        // Sesuaikan dengan ABI Normal Pool Anda
        try {
          stakedResult = await publicClient.readContract({
            address: contractAddress,
            abi: NORMAL_STAKING_ABI,
            functionName: "stakedBalance", // Ganti dengan nama function yang sesuai
            args: [address]
          });
        } catch (error) {
          // Fallback: mungkin menggunakan userInfo juga
          const userInfo = await publicClient.readContract({
            address: contractAddress,
            abi: NORMAL_STAKING_ABI,
            functionName: "userInfo",
            args: [address]
          });
          stakedResult = userInfo[0];
        }
      }

      const formattedStaked = formatUnits(stakedResult, stakeDecimals);
      setStakedAmount(formattedStaked);

      console.log("===== USER DATA DEBUG =====");
      console.log("Contract:", contractAddress);
      console.log("Address:", address);
      console.log("Raw Pending:", pendingResult.toString());
      console.log("Formatted Pending:", formattedPending, rewardToken);
      console.log("Raw Staked:", stakedResult.toString());
      console.log("Formatted Staked:", formattedStaked, "LIQ");
      console.log("===========================");

    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  useEffect(() => {
    loadUserData();

    const interval = setInterval(loadUserData, 8000);
    return () => clearInterval(interval);
  }, [address, publicClient, contractAddress]);

  const handleClaim = async () => {
    if (!isConnected || !walletClient) return;

    try {
      setLoading(true);

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: "claim"
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await loadUserData();
    } catch (err) {
      console.error("Claim error:", err);
      alert(err?.shortMessage || err?.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      {/* My Stake Section */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
        <p className="text-gray-400 text-sm">My Stake</p>
        <p className="text-lg font-semibold text-blue-400">
          {Number(stakedAmount).toFixed(4)} LIQ
        </p>
      </div>

      {/* Pending Reward Section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-sm">Pending Reward</p>
        <p className="text-lg font-semibold text-purple-400">
          {Number(pending).toFixed(6)} {rewardToken}
        </p>
      </div>

      <button
        onClick={handleClaim}
        disabled={loading || Number(pending) <= 0}
        className={`w-full transition rounded-2xl py-3 font-semibold shadow-lg ${
          Number(pending) <= 0
            ? "bg-gray-600 cursor-not-allowed shadow-gray-500/30"
            : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30"
        }`}
      >
        {loading ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}
