'use client';

import { useState, useEffect } from 'react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
    } catch {
      setIsAuthenticated(false);
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2b00d9] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-[#2b00d9]/5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] border border-[#c7d2fe] flex items-center justify-center text-[#2b00d9] text-xl font-bold mx-auto">
              🔒
            </div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-[#64748b] font-medium leading-relaxed">
              Enter admin credentials to access software intelligence management & data operations portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] text-xs font-bold p-3.5 rounded-xl text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f172a]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#2b00d9] focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f172a]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#2b00d9] focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2b00d9] hover:bg-[#1f00a8] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/20"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Unlock Portal 🔑'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#dc2626] font-bold text-xs px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5"
        >
          <span>🚪</span>
          <span>Log Out Admin</span>
        </button>
      </div>
      {children}
    </div>
  );
}
