import { useState, useEffect } from "react";
import { useWalletClient, usePublicClient, useAccount, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { BNB_STAKING_ABI } from "../../../config/contracts2";

export default function StakeFormBnb({ contractAddress, onStakeSuccess }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Get BNB balance
  const { data: bnbBalance } = useBalance({
    address: address,
    watch: true,
  });

  const handleSetPercentage = (percentage) => {
    if (!bnbBalance) return;

    const balanceNum = parseFloat(bnbBalance.formatted);
    if (balanceNum <= 0) return;

    let value;
    if (percentage === 25) {
      value = balanceNum * 0.25;
    } else if (percentage === 50) {
      value = balanceNum * 0.5;
    } else if (percentage === 100) {
      value = balanceNum;
    }

    setAmount(value.toFixed(6));
  };

  const handleStake = async () => {
    if (!isConnected || !walletClient) return;
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = bnbBalance ? parseFloat(bnbBalance.formatted) : 0;

    if (amountNum > balanceNum) {
      alert("Insufficient BNB balance");
      return;
    }

    try {
      setIsLoading(true);
      const value = parseEther(amount); // BNB = 18 decimals

      console.log("Depositing BNB...");
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: BNB_STAKING_ABI,
        functionName: "deposit",
        value: value, // Send BNB with transaction
        args: []
      });

      await publicClient.waitForTransactionReceipt({ hash });
      console.log("Deposited!");

      if (onStakeSuccess) {
        onStakeSuccess();
      }

      setAmount("");
      alert("Stake successful!");

    } catch (error) {
      console.error("Stake error:", error);
      alert(error?.shortMessage || error?.message || "Error staking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Balance Display */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Your BNB Balance</p>
        <p className="text-sm font-semibold text-white">
          {bnbBalance ? parseFloat(bnbBalance.formatted).toFixed(6) : "0"} BNB
        </p>
      </div>

      {/* Input Field */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 bg-white/5 rounded-xl mb-2"
        placeholder="Amount in BNB"
        disabled={isLoading}
        step="0.000001"
        min="0"
      />

      {/* Percentage Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleSetPercentage(25)}
          disabled={isLoading || !bnbBalance || parseFloat(bnbBalance.formatted) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          25%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(50)}
          disabled={isLoading || !bnbBalance || parseFloat(bnbBalance.formatted) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(100)}
          disabled={isLoading || !bnbBalance || parseFloat(bnbBalance.formatted) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MAX
        </button>
      </div>

      {/* Stake Button */}
      <button
        onClick={handleStake}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-xl transition ${
          isLoading || !amount || parseFloat(amount) <= 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-yellow-600 hover:bg-yellow-700"
        }`}
      >
        {isLoading ? "Processing..." : "Stake BNB"}
      </button>
    </div>
  );
}
