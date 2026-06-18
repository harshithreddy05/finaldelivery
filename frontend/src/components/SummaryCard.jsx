const SummaryCard = ({ label, value }) => (
  <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
    <div className="text-xs uppercase tracking-[0.35em] font-semibold text-slate-500">{label}</div>
    <div className="mt-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{value}</div>
  </div>
);

export default SummaryCard;
