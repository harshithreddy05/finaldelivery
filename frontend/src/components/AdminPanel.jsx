const AdminPanel = ({ stats, history, onRefresh, onClearCache, isLoading }) => {
  return (
    <section className="mt-10 rounded-3xl bg-slate-950/95 p-6 text-slate-100 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Admin Panel</h2>
          <p className="mt-2 max-w-2xl text-slate-400">Review slot performance, cancel older bookings, and inspect booking history.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Refresh Admin
          </button>
          <button
            onClick={onClearCache}
            className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
          >
            Clear Cache
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin Slots</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats?.totalSlots ?? '—'}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Full Slots</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats?.fullSlots ?? '—'}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Available Capacity</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats?.totalAvailable ?? '—'}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Booking History</h3>
          {isLoading && <span className="text-sm text-slate-400">Updating…</span>}
        </div>

        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/90 p-6 text-slate-500">
              No history recorded yet.
            </div>
          ) : (
            history.slice(0, 10).map((record) => (
              <div key={record.id} className="rounded-3xl bg-slate-900/80 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">{record.action.toUpperCase()}</p>
                    <p className="mt-1 text-base font-semibold text-white">{record.slot.time}</p>
                  </div>
                  <p className="text-sm text-slate-400">{new Date(record.time).toLocaleString()}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <span>Booked: {record.slot.booked}</span>
                  <span>Capacity: {record.slot.capacity}</span>
                  <span>Available: {record.slot.availableSpaces}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
