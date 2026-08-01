'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, Notification, setTokens } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { LogOut, Moon, Sun } from 'lucide-react';

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('sp_theme', next ? 'dark' : 'light');
    setDark(next);
  };
  return { dark, toggle };
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    api.me().then(setUser);
    api.notifications().then(setNotifications);
  }, []);

  async function logout() {
    await api.logout().catch(() => {});
    setTokens(null);
    router.push('/login');
  }

  if (!user) return <div className="p-8">Loading…</div>;

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="text-4xl mb-2">Settings</h1>
      <p className="text-muted mb-8">Your account, wallet, and notifications.</p>

      {/* wallet */}
      <section className="card mb-6">
        <h2 className="text-sm text-muted uppercase tracking-wide font-semibold mb-4">Connected Wallet</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE] grid place-items-center text-2xl">
            🔗
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm truncate">{user.walletAddress}</p>
            <p className="text-xs text-muted">Stellar testnet</p>
          </div>
        </div>
      </section>

      {/* notifications */}
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-muted uppercase tracking-wide font-semibold">Notifications</h2>
          {notifications.some((n) => !n.read) && (
            <button className="text-jade text-xs font-semibold" onClick={() => api.markAllNotificationsRead().then(() => api.notifications().then(setNotifications))}>
              Mark all read
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-56 overflow-y-auto scroll-fade">
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className={'w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ' + (n.read ? 'bg-clay/40 text-muted' : 'bg-jade/10 text-jade')}>
                {n.read ? '✓' : '!'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={n.read ? 'text-muted text-sm' : 'font-medium text-sm'}>{n.title}</p>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-muted/60 mt-1">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* theme (PRD Doc 4 — Profile contains Theme) */}
      <section className="card mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm text-muted uppercase tracking-wide font-semibold">Theme</h2>
          <p className="text-sm text-muted mt-1">{dark ? 'Evening (dark)' : 'Moon Sand (light)'}</p>
        </div>
        <button
          onClick={toggle}
          className="btn-ghost !p-3"
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </section>

      {/* member since */}
      <section className="card mb-6">
        <h2 className="text-sm text-muted uppercase tracking-wide font-semibold mb-3">Account</h2>
        <p className="font-medium">{user.name}</p>
        <p className="text-muted text-sm">{user.email}</p>
        <p className="text-muted text-xs mt-2">Member since {formatDate(user.createdAt)}</p>
      </section>

      <button onClick={logout} className="btn-ghost w-full !text-danger hover:!bg-danger/10">
        <LogOut size={18} /> Log out
      </button>
    </main>
  );
}
