import { useState } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { parseUnits } from "viem";
import {
  STAKING_ABI,
  ERC20_ABI,
  USDT_TOKEN_ADDRESS
} from "../../config/contracts";


export default function StakeForm({
  token,
  contractAddress,
  isNative,
  usdtAddress
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  console.log("walletClient:", walletClient);

  const publicClient = usePublicClient();

  const decimals = token === "USDT" ? 6 : 18;

  const handleStake = async () => {
    if (!isConnected) {
      alert("Please connect wallet");
      return;
    }

    if (!walletClient) {
      alert("Wallet client not ready");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    setLoading(true);

    const value = parseUnits(amount, decimals);

    try {
      if (isNative) {
        const hash = await walletClient.writeContract({
          address: contractAddress,
          abi: STAKING_ABI,
          functionName: "deposit",
          args: [0n],
          value
        });

        await publicClient.waitForTransactionReceipt({ hash });

      } else {
        const approveHash = await walletClient.writeContract({
          address: USDT_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [contractAddress, value]
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        const stakeHash = await walletClient.writeContract({
          address: contractAddress,
          abi: STAKING_ABI,
          functionName: "deposit",
          args: [value]
        });

        await publicClient.waitForTransactionReceipt({ hash: stakeHash });
      }

      setAmount("");

    } catch (err) {
      console.error("TX ERROR:", err);
      alert(err?.shortMessage || err?.message);
    }

    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!walletClient) return;
    setLoading(true);

    const value = parseUnits(amount, decimals);

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: STAKING_ABI,
      functionName: "withdraw",
      args: [value]
    });

    await publicClient.waitForTransactionReceipt({ hash });

    setLoading(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
        <input
          type="number"
          placeholder={`Enter ${token} amount`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent flex-1 outline-none text-white"
        />
        <span className="text-gray-400">{token}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleStake}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 transition rounded-2xl py-3 font-semibold shadow-lg shadow-indigo-500/30"
        >
          {loading ? "Processing..." : "Stake"}
        </button>

        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 transition rounded-2xl py-3 font-semibold"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
