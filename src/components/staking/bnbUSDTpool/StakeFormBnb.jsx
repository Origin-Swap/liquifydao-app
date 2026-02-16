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

  // Get BNB balance dengan safe defaults
  const { data: bnbBalance, isLoading: balanceLoading, isError, refetch } = useBalance({
    address: address,
    watch: true,
    enabled: !!address,
  });

  // Format balance dari value (karena formatted undefined)
  const getFormattedBalance = () => {
    // Coba dari value dulu (paling reliable)
    if (bnbBalance?.value) {
      try {
        const formatted = formatEther(bnbBalance.value);
        const num = parseFloat(formatted);
        if (!isNaN(num)) {
          return num.toFixed(6);
        }
      } catch (error) {
        console.error("Error formatting from value:", error);
      }
    }

    // Fallback ke formatted jika ada
    if (bnbBalance?.formatted) {
      try {
        const normalizedString = bnbBalance.formatted.replace(',', '.');
        const num = parseFloat(normalizedString);
        if (!isNaN(num)) {
          return num.toFixed(6);
        }
      } catch {
        // Silent fail
      }
    }

    return "0.000000";
  };

  // Safe numeric balance dari value
  const getNumericBalance = () => {
    // Coba dari value dulu
    if (bnbBalance?.value) {
      try {
        const formatted = formatEther(bnbBalance.value);
        const num = parseFloat(formatted);
        if (!isNaN(num)) {
          return num;
        }
      } catch {}
    }

    // Fallback ke formatted
    if (bnbBalance?.formatted) {
      try {
        const normalizedString = bnbBalance.formatted.replace(',', '.');
        const num = parseFloat(normalizedString);
        if (!isNaN(num)) {
          return num;
        }
      } catch {}
    }

    return 0;
  };

  const handleSetPercentage = (percentage) => {
    const balanceNum = getNumericBalance();
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
    if (!isConnected || !walletClient) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = getNumericBalance();

    if (amountNum > balanceNum) {
      alert("Insufficient BNB balance");
      return;
    }

    try {
      setIsLoading(true);
      const value = parseEther(amount);

      console.log("Depositing BNB...", {
        amount,
        value: value.toString(),
        balance: bnbBalance?.value?.toString()
      });

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: BNB_STAKING_ABI,
        functionName: "deposit",
        value: value,
        args: []
      });

      console.log("Transaction sent:", hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed:", receipt);

      // Refetch balance after successful stake
      await refetch();

      if (onStakeSuccess) {
        onStakeSuccess();
      }

      setAmount("");
      alert("Stake successful!");

    } catch (error) {
      console.error("Stake error:", error);

      if (error?.message?.includes("user rejected")) {
        alert("Transaction cancelled");
      } else if (error?.message?.includes("insufficient funds")) {
        alert("Insufficient BNB for gas");
      } else {
        alert(error?.shortMessage || error?.message || "Error staking");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug log - tampilkan semua cara format
  useEffect(() => {
    if (bnbBalance) {
      console.log("===== BNB BALANCE DEBUG =====");
      console.log("Address:", address);
      console.log("isConnected:", isConnected);
      console.log("Raw value:", bnbBalance.value?.toString());
      console.log("Formatted from value:", formatEther(bnbBalance.value));
      console.log("getFormattedBalance():", getFormattedBalance());
      console.log("getNumericBalance():", getNumericBalance());
      console.log("============================");
    }
  }, [address, isConnected, bnbBalance]);

  return (
    <div className="mb-6">
      {/* Balance Display */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Your BNB Balance</p>
        <p className="text-sm font-semibold text-white">
          {balanceLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : isError ? (
            <span className="text-red-400">Error loading</span>
          ) : bnbBalance?.value ? (
            `${getFormattedBalance()} BNB`
          ) : (
            "0.000000 BNB"
          )}
        </p>
      </div>

      {/* Input Field */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 bg-white/5 rounded-xl mb-2"
        placeholder="Amount in BNB"
        disabled={isLoading || !isConnected}
        step="0.000001"
        min="0"
      />

      {/* Percentage Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleSetPercentage(25)}
          disabled={isLoading || !isConnected || getNumericBalance() <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          25%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(50)}
          disabled={isLoading || !isConnected || getNumericBalance() <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => handleSetPercentage(100)}
          disabled={isLoading || !isConnected || getNumericBalance() <= 0}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MAX
        </button>
      </div>

      {/* Stake Button */}
      <button
        onClick={handleStake}
        disabled={isLoading || !isConnected || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-xl transition ${
          isLoading || !isConnected || !amount || parseFloat(amount) <= 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-yellow-600 hover:bg-yellow-700"
        }`}
      >
        {isLoading ? "Processing..." : !isConnected ? "Connect Wallet" : "Stake BNB"}
      </button>
    </div>
  );
}
