import { useEffect, useMemo, useState } from 'react';
import SlotCard from './components/SlotCard';
import SummaryCard from './components/SummaryCard';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RecommendationCard from './components/RecommendationCard';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';
const STORAGE_KEYS = {
  slots: 'dsbs_cached_slots',
  history: 'dsbs_cached_history',
  adminAuthorized: 'dsbs_admin_authorized'
};

const fetchSlots = async () => {
  const response = await fetch(`${API_BASE}/slots`);
  if (!response.ok) throw new Error('Unable to load slots');
  const data = await response.json();
  return data.slots || [];
};

const fetchHistory = async () => {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error('Unable to load booking history');
  return response.json();
};

const fetchAdminStats = async () => {
  const response = await fetch(`${API_BASE}/admin/stats`);
  if (!response.ok) throw new Error('Unable to load admin statistics');
  return response.json();
};

const bookSlot = async (slotId) => {
  const response = await fetch(`${API_BASE}/book/${slotId}`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Booking failed');
  return data;
};

const cancelSlot = async (slotId) => {
  const response = await fetch(`${API_BASE}/cancel/${slotId}`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Cancellation failed');
  return data;
};

function App() {
  const [slots, setSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.adminAuthorized)) || false;
    } catch {
      return false;
    }
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    try {
      const savedSlots = JSON.parse(localStorage.getItem(STORAGE_KEYS.slots));
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.history));

      if (Array.isArray(savedSlots)) {
        setSlots(savedSlots);
      }
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
    } catch (error) {
      console.warn('Invalid local storage data', error);
    }

    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.slots, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.adminAuthorized, JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const handleAdminLogin = ({ username, password }) => {
    if (username !== 'admin' || password !== 'admin123') {
      throw new Error('Invalid admin credentials.');
    }
    setIsAdminLoggedIn(true);
    setShowAdminPanel(true);
    setShowLoginForm(false);
    showToast('Admin login successful.', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminPanel(false);
    setShowLoginForm(false);
    showToast('Admin logged out.', 'success');
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [slotsData, historyData, statsData] = await Promise.all([
        fetchSlots(),
        fetchHistory(),
        fetchAdminStats()
      ]);
      setSlots(slotsData);
      setHistory(historyData.history || []);
      setAdminStats(statsData.stats || null);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshAdminAndHistory = async () => {
    try {
      const [historyData, statsData] = await Promise.all([fetchHistory(), fetchAdminStats()]);
      setHistory(historyData.history || []);
      setAdminStats(statsData.stats || null);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validateAction = (slot, action) => {
    if (!slot) throw new Error('Slot not found. Please refresh and try again.');
    if (action === 'book' && slot.status === 'Full') {
      throw new Error('This slot is full. Choose another slot or use the recommended slot.');
    }
    if (action === 'cancel' && slot.booked <= 0) {
      throw new Error('No bookings exist for this slot to cancel.');
    }
  };

  const handleBooking = async (id) => {
    const slot = slots.find((item) => item.id === id);
    try {
      validateAction(slot, 'book');
      setIsBooking(true);
      const data = await bookSlot(id);
      showToast(data.message, 'success');
      setSlots((current) => current.map((item) => (item.id === id ? data.slot : item)));
      await refreshAdminAndHistory();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancel = async (id) => {
    const slot = slots.find((item) => item.id === id);
    try {
      validateAction(slot, 'cancel');
      const approved = window.confirm(`Cancel one booking for ${slot.time}?`);
      if (!approved) return;
      setIsBooking(true);
      const data = await cancelSlot(id);
      showToast(data.message, 'success');
      setSlots((current) => current.map((item) => (item.id === id ? data.slot : item)));
      await refreshAdminAndHistory();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const recommendedSlot = useMemo(() => {
    const available = slots.filter((slot) => slot.status === 'Available');
    if (!available.length) return null;
    return available
      .map((slot) => ({
        slot,
        score: slot.availableSpaces * 100 - slot.utilization
      }))
      .sort((a, b) => b.score - a.score)[0].slot;
  }, [slots]);

  const totals = useMemo(() => {
    const totalSlots = slots.length;
    const totalCapacity = slots.reduce((total, slot) => total + slot.capacity, 0);
    const totalBooked = slots.reduce((total, slot) => total + slot.booked, 0);
    const totalAvailable = slots.reduce((total, slot) => total + slot.availableSpaces, 0);
    return { totalSlots, totalCapacity, totalBooked, totalAvailable };
  }, [slots]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-6 text-white shadow-soft">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Delivery Slot Booking</p>
              <h1 className="mt-2 text-3xl font-semibold">Modern Delivery Slot Dashboard</h1>
              <p className="mt-2 max-w-2xl text-slate-100/90">Manage delivery slots, cancel bookings, and get smart suggestions with admin history and validation.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Refresh Data
              </button>
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowAdminPanel((current) => !current)}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15"
                  >
                    {showAdminPanel ? 'Hide Admin' : 'Show Admin'}
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    Logout Admin
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginForm((current) => !current)}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15"
                >
                  {showLoginForm ? 'Close Login' : 'Admin Login'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showLoginForm && !isAdminLoggedIn && (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
            <AdminLogin onLogin={handleAdminLogin} />
          </div>
        )}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total Slots" value={totals.totalSlots} />
            <SummaryCard label="Total Capacity" value={totals.totalCapacity} />
            <SummaryCard label="Total Bookings" value={totals.totalBooked} />
            <SummaryCard label="Available Slots" value={totals.totalAvailable} />
          </div>
          <RecommendationCard
            slot={recommendedSlot}
            onBook={() => recommendedSlot && handleBooking(recommendedSlot.id)}
          />
        </section>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Slot Availability</h2>
              <p className="mt-2 text-slate-500">Choose a slot and book with confidence. Cancel bookings directly from the dashboard.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {loading ? 'Refreshing slot data…' : `${totals.totalSlots} slots loaded`}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                disabled={isBooking}
                onBook={() => handleBooking(slot.id)}
                onCancel={() => handleCancel(slot.id)}
                isRecommended={recommendedSlot?.id === slot.id}
              />
            ))}
          </div>

          {!loading && slots.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              No slots are available at this time.
            </div>
          )}
        </section>

        {isAdminLoggedIn && showAdminPanel && (
          <AdminPanel
            stats={adminStats}
            history={history}
            onRefresh={refreshAdminAndHistory}
            onClearCache={() => {
              localStorage.removeItem(STORAGE_KEYS.slots);
              localStorage.removeItem(STORAGE_KEYS.history);
              showToast('Local cache cleared.', 'success');
            }}
            isLoading={loading}
          />
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
