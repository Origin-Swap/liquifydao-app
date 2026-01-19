export const SectionCard = ({ title, children }) => {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
};
