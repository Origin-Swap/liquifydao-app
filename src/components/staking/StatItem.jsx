export default function StatItem({ label, value }) {
  return (
    <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-700">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
