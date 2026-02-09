import PoolCard from "./PoolCard";

export const StakingPage= () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Liquify Staking
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Earn sustainable rewards by staking BNB or USDT. Flexible. Transparent. Powerful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <PoolCard
            title="Stake BNB"
            apy="10%"
            token="BNB"
            gradient="from-yellow-400 to-orange-500"
            tvl={1245823}
            stakers={842}
          />

          <PoolCard
            title="Stake USDT"
            apy="8%"
            token="USDT"
            gradient="from-emerald-400 to-green-500"
            tvl={984211}
            stakers={615}
          />
        </div>
      </div>
    </div>
  );
}
