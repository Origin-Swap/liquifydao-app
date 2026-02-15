import { useState } from "react";
import NormalPoolCard from "./NormalPoolCard";
import GenesisPoolCard from "./GenesisPoolCard";
import { StakingBNBUSDTPage } from "./bnbUSDTpool/StakingPage";
import {
  NORMAL_STAKING_ADDRESS,
  GENESIS_STAKING_ADDRESS
} from "../../config/contracts";

export const StakingPage = () => {
  const [activeTab, setActiveTab] = useState("live"); // Default ke "live"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Liquify Staking</h1>
          <p className="text-gray-400 mt-2">
            Choose your pool and start earning
          </p>
        </div>

        {/* Tab Navigation - LIVE di kiri, UPCOMING di kanan */}
        <div className="flex justify-center gap-4 mb-8">
          {/* LIVE Tab - PERTAMA */}
          <button
            onClick={() => setActiveTab("live")}
            className={`relative px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "live"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-md font-medium text-green-400">LIVE Pools</span>
              </span>
            </span>
            {activeTab === "live" && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30 animate-pulse" />
            )}
          </button>

          {/* UPCOMING Tab - KEDUA */}
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "upcoming"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              🚀 Upcoming Pools
            </span>
            {activeTab === "upcoming" && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/30 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "live" ? (
            <div className="animate-fadeIn">
              <StakingBNBUSDTPage />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
              <NormalPoolCard contractAddress={NORMAL_STAKING_ADDRESS} />
              <GenesisPoolCard contractAddress={GENESIS_STAKING_ADDRESS} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Tambahkan CSS untuk animasi fadeIn
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
