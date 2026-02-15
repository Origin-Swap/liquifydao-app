import { useState, useEffect } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import {
  GENESIS_STAKING_ABI,
  LIQUIFY_TOKEN_ADDRESS,
  ERC20_ABI
} from "../../config/contracts";

export default function StakeFormGenesis({ contractAddress, onStakeSuccess }) {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Load user's LIQUIFY balance
  const loadBalance = async () => {
    if (!address || !publicClient) return;

    try {
      const balanceRaw = await publicClient.readContract({
        address: LIQUIFY_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address]
      });

      const formattedBalance = formatUnits(balanceRaw, 18);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  useEffect(() => {
    if (address) {
      loadBalance();
    }
  }, [address, publicClient]);

  const handleSetPercentage = (percentage) => {
    const balanceNum = parseFloat(balance);
    if (balanceNum <= 0) return;

    let value;
    if (percentage === 25) {
      value = balanceNum * 0.25;
    } else if (percentage === 50) {
      value = balanceNum * 0.5;
    } else if (percentage === 100) {
      value = balanceNum;
    }

    // Format to 4 decimal places max
    setAmount(value.toFixed(4));
  };

  const handleStake = async () => {
    if (!isConnected || !walletClient) return;
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(balance);

    if (amountNum > balanceNum) {
      alert("Insufficient balance");
      return;
    }

    try {
      setIsLoading(true);
      const value = parseUnits(amount, 18); // LIQ = 18 decimals

      console.log("Approving...");
      const approveHash = await walletClient.writeContract({
        address: LIQUIFY_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contractAddress, value]
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });
      console.log("Approved!");

      console.log("Depositing...");
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: GENESIS_STAKING_ABI,
        functionName: "deposit",
        args: [value]
      });

      await publicClient.waitForTransactionReceipt({ hash });
      console.log("Deposited!");

      // Refresh balance and trigger parent refresh
      await loadBalance();
      if (onStakeSuccess) {
        onStakeSuccess();
      }

      setAmount(""); // Clear input
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
        <p className="text-gray-400 text-sm">Your Balance</p>
        <p className="text-sm font-semibold text-white">
          {parseFloat(balance).toFixed(4)} LIQ
        </p>
      </div>

      {/* Input Field */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 bg-white/5 rounded-xl mb-2"
        placeholder="Amount in LIQ"
        disabled={isLoading}
      />

      {/* Percentage Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleSetPercentage(25)}
          disabled={isLoading || parseFloat(balance) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          25%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(50)}
          disabled={isLoading || parseFloat(balance) <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(100)}
          disabled={isLoading || parseFloat(balance) <= 0}
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
        {isLoading ? "Processing..." : "Stake LIQ in Genesis Pool"}
      </button>
    </div>
  );
}
