export default function ClaimSection() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-sm">Pending Reward</p>
        <p className="text-lg font-semibold text-purple-400">
          0 LIQUIFY
        </p>
      </div>

      <button className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-2xl py-3 font-semibold shadow-lg shadow-purple-500/30">
        Claim Rewards
      </button>
    </div>
  );
}
