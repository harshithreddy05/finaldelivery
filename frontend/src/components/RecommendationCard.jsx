const RecommendationCard = ({ slot, onBook }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-600 p-6 text-white shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/80">Smart Recommendation</p>
          <h2 className="mt-3 text-2xl font-semibold">Best Next Slot</h2>
        </div>
      </div>

      {slot ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl bg-white/10 p-5 text-slate-100 shadow-inner">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Time</p>
            <p className="mt-2 text-xl font-semibold">{slot.time}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/80">Available</p>
              <p className="mt-2 text-2xl font-semibold">{slot.availableSpaces}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/80">Utilization</p>
              <p className="mt-2 text-2xl font-semibold">{slot.utilization}%</p>
            </div>
          </div>
          <button
            onClick={onBook}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Book Recommended Slot
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-white/10 p-5 text-slate-100">
          <p className="text-sm text-cyan-100/80">No available slot recommendation right now.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
