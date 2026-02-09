import AnimatedCounter from "./AnimatedCounter";
import StakeForm from "./StakeForm";
import ClaimSection from "./ClaimSection";

export default function PoolCard({
  title,
  apy,
  token,
  gradient,
  tvl,
  stakers
}) {
  return (
    <div className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">

      {/* Glow background */}
      <div className={`absolute inset-0 opacity-20 blur-3xl bg-gradient-to-r ${gradient}`} />

      <div className="relative z-10">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-400 text-sm">Flexible staking</p>
          </div>

          <div className={`px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${gradient} shadow-lg shadow-yellow-500/30 animate-pulse`}>
            {apy} APY
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Value Locked</p>
            <AnimatedCounter value={tvl} prefix="$" />
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Total Stakers</p>
            <AnimatedCounter value={stakers} />
          </div>
        </div>

        <StakeForm token={token} />
        <ClaimSection />
      </div>
    </div>
  );
}
