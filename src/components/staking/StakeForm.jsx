import { useState } from "react";

export default function StakeForm({ token }) {
  const [amount, setAmount] = useState("");

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
        <button className="bg-indigo-600 hover:bg-indigo-700 transition rounded-2xl py-3 font-semibold shadow-lg shadow-indigo-500/30">
          Stake
        </button>

        <button className="bg-gray-700 hover:bg-gray-600 transition rounded-2xl py-3 font-semibold">
          Withdraw
        </button>
      </div>
    </div>
  );
}
