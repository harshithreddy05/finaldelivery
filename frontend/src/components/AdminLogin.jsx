import { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Both fields are required.');
      return;
    }

    try {
      await onLogin({ username: username.trim(), password: password.trim() });
      setUsername('');
      setPassword('');
    } catch (loginError) {
      setError(loginError.message || 'Login failed');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-slate-900">Admin Login</h2>
      <p className="mt-2 text-sm text-slate-600">Enter admin credentials to manage bookings and view history.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="admin"
            aria-label="Admin username"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="••••••••"
            aria-label="Admin password"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
