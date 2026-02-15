import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import {
  BNB_STAKING_ABI,
  USDT_STAKING_ABI
} from "../../../config/contracts2";

export default function ClaimSection({
  contractAddress,
  rewardToken,     // "LIQ"
  poolType         // "bnb" or "usdt"
}) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [pending, setPending] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [loading, setLoading] = useState(false);

  const rewardDecimals = 18; // LIQ = 18 decimals
  const stakeDecimals = poolType === "bnb" ? 18 : 6; // BNB = 18, USDT = 6
  const stakeToken = poolType === "bnb" ? "BNB" : "USDT";
  const abi = poolType === "bnb" ? BNB_STAKING_ABI : USDT_STAKING_ABI;

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
      const userInfo = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "userInfo",
        args: [address]
      });

      const stakedAmountRaw = userInfo[0]; // amount di index 0
      const formattedStaked = formatUnits(stakedAmountRaw, stakeDecimals);
      setStakedAmount(formattedStaked);

      console.log("===== USER DATA DEBUG =====");
      console.log("Contract:", contractAddress);
      console.log("Address:", address);
      console.log("Raw Pending:", pendingResult.toString());
      console.log("Formatted Pending:", formattedPending, rewardToken);
      console.log("Raw Staked:", stakedAmountRaw.toString());
      console.log("Formatted Staked:", formattedStaked, stakeToken);
      console.log("UserInfo:", {
        amount: userInfo[0].toString(),
        lastUpdate: userInfo[1].toString(),
        unclaimed: userInfo[2].toString()
      });
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
        <p className="text-gray-400 text-sm">My Staked {stakeToken}</p>
        <p className="text-lg font-semibold text-blue-400">
          {Number(stakedAmount).toFixed(poolType === "bnb" ? 6 : 2)} {stakeToken}
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
