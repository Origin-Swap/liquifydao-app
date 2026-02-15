import { useState, useEffect } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { BNB_STAKING_ABI } from "../../../config/contracts2";

export default function WithdrawFormBnb({ contractAddress, onWithdrawSuccess }) {
  const [amount, setAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Load user's staked balance
  const loadStakedBalance = async () => {
    if (!address || !publicClient) return;

    try {
      const userInfo = await publicClient.readContract({
        address: contractAddress,
        abi: BNB_STAKING_ABI,
        functionName: "userInfo",
        args: [address]
      });

      const stakedAmount = userInfo[0]; // amount di index 0
      const formattedStaked = formatEther(stakedAmount); // BNB = 18 decimals
      setStakedBalance(formattedStaked);
    } catch (error) {
      console.error("Error loading staked balance:", error);
    }
  };

  useEffect(() => {
    if (address) {
      loadStakedBalance();
    }
  }, [address, publicClient, contractAddress]);

  const handleSetPercentage = (percentage) => {
    const stakedNum = parseFloat(stakedBalance);
    if (stakedNum <= 0) return;

    let value;
    if (percentage === 25) {
      value = stakedNum * 0.25;
    } else if (percentage === 50) {
      value = stakedNum * 0.5;
    } else if (percentage === 100) {
      value = stakedNum;
    }

    setAmount(value.toFixed(6));
  };

  const handleWithdraw = async () => {
    if (!isConnected || !walletClient) return;
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amountNum = parseFloat(amount);
    const stakedNum = parseFloat(stakedBalance);

    if (amountNum > stakedNum) {
      alert("Insufficient staked balance");
      return;
    }

    try {
      setIsLoading(true);
      const value = parseEther(amount); // BNB = 18 decimals

      console.log("Withdrawing BNB...");
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: BNB_STAKING_ABI,
        functionName: "withdraw",
        args: [value]
      });

      await publicClient.waitForTransactionReceipt({ hash });
      console.log("Withdrawn!");

      await loadStakedBalance();
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }

      setAmount("");
      alert("Withdraw successful!");

    } catch (error) {
      console.error("Withdraw error:", error);
      alert(error?.shortMessage || error?.message || "Error withdrawing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Staked Balance Display */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Your Staked BNB</p>
        <p className="text-sm font-semibold text-white">
          {parseFloat(stakedBalance).toFixed(6)} BNB
        </p>
      </div>

      {/* Input Field */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 bg-white/5 rounded-xl mb-2"
        placeholder="Amount to withdraw"
        disabled={isLoading}
        step="0.000001"
        min="0"
      />

      {/* Percentage Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleSetPercentage(25)}
          disabled={isLoading || parseFloat(stakedBalance) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          25%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(50)}
          disabled={isLoading || parseFloat(stakedBalance) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(100)}
          disabled={isLoading || parseFloat(stakedBalance) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MAX
        </button>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-xl transition ${
          isLoading || !amount || parseFloat(amount) <= 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isLoading ? "Processing..." : "Withdraw BNB"}
      </button>
    </div>
  );
}
