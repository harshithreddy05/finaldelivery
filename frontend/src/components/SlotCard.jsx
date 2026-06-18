const SlotCard = ({ slot, disabled, onBook, onCancel, isRecommended }) => {
  return (
    <article className={`rounded-3xl border p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl ${
      isRecommended ? 'border-cyan-400 bg-cyan-50/70' : 'border-slate-200 bg-white'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Delivery Time</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{slot.time}</h3>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
          slot.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {slot.status}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">Capacity</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">{slot.capacity}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">Booked</p>
            <p className="mt-2 text-2xl font-bold text-purple-900">{slot.booked}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">Available Spaces</p>
            <span className="text-lg font-bold text-emerald-900">{slot.availableSpaces}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600 font-semibold">Utilization</span>
          <span className="font-semibold text-slate-900">{slot.utilization}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              slot.status === 'Full'
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            style={{ width: `${slot.utilization}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={onBook}
          disabled={disabled || slot.status === 'Full'}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            disabled || slot.status === 'Full'
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
          }`}
        >
          {slot.status === 'Full' ? 'Slot Full' : 'Book Slot'}
        </button>
        <button
          onClick={onCancel}
          disabled={disabled || slot.booked <= 0}
          className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            disabled || slot.booked <= 0
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
              : 'border-red-400 bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          Cancel Booking
        </button>
      </div>
    </article>
  );
};

export default SlotCard;
