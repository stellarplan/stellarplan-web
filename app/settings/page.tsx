'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, Notification, setTokens } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { LogOut, Moon, Sun, Bell, Wallet, User as UserIcon } from 'lucide-react';

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light')); }, []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('sp_theme', next ? 'dark' : 'light');
    setDark(next);
  };
  return { dark, toggle };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl mb-4 overflow-hidden" style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.8)' }}>
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(30,45,69,0.7)' }}>
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'hsl(222,22%,50%)' }}>{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
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

  if (!user) return (
    <div className="p-8 text-center py-20" style={{ color: 'hsl(222,22%,55%)' }}>
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: 'hsl(217,91%,60%)' }} />
        Loading…
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="mb-1" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Settings</h1>
      <p className="mb-8 text-sm" style={{ color: 'hsl(222,22%,50%)' }}>Your account, wallet, and preferences.</p>

      {/* Account */}
      <Section title="Account">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(59,130,246,0.25)' }}>
            <UserIcon size={22} style={{ color: 'hsl(217,91%,60%)' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'hsl(228,60%,93%)' }}>{user.name}</p>
            <p className="text-sm" style={{ color: 'hsl(222,22%,55%)' }}>{user.email}</p>
            <p className="text-xs mt-1" style={{ color: 'hsl(222,22%,42%)' }}>Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Section>

      {/* Wallet */}
      <Section title="Connected Wallet">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Wallet size={22} style={{ color: 'hsl(38,92%,50%)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm truncate" style={{ color: 'hsl(217,91%,60%)', fontFamily: 'var(--font-mono)' }}>{user.walletAddress ?? 'Not connected'}</p>
            <p className="text-xs" style={{ color: 'hsl(222,22%,50%)' }}>Stellar testnet</p>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={15} style={{ color: 'hsl(222,22%,50%)' }} />
            <span className="text-sm font-medium" style={{ color: 'hsl(228,60%,80%)' }}>{notifications.filter(n => !n.read).length} unread</span>
          </div>
          {notifications.some((n) => !n.read) && (
            <button id="mark-all-read" className="text-xs font-bold hover:underline" style={{ color: 'hsl(217,91%,60%)' }}
              onClick={() => api.markAllNotificationsRead().then(() => api.notifications().then(setNotifications))}>
              Mark all read
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto scroll-fade">
          {notifications.length === 0 && <p className="text-sm" style={{ color: 'hsl(222,22%,45%)' }}>No notifications yet.</p>}
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold"
                style={n.read ? { background: 'rgba(30,45,69,0.6)', color: 'hsl(222,22%,50%)' } : { background: 'rgba(59,130,246,0.15)', color: 'hsl(217,91%,60%)', border: '1px solid rgba(59,130,246,0.25)' }}>
                {n.read ? '✓' : '!'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: n.read ? 'hsl(222,22%,55%)' : 'hsl(228,60%,93%)' }}>{n.title}</p>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'hsl(222,22%,45%)' }}>{n.message}</p>
                <p className="text-xs mt-1" style={{ color: 'hsl(222,22%,38%)' }}>{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm" style={{ color: 'hsl(228,60%,93%)' }}>{dark ? 'Dark Mode' : 'Light Mode'}</p>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(222,22%,50%)' }}>{dark ? 'Deep Space Stellar' : 'Light mode'}</p>
          </div>
          <button id="theme-toggle" onClick={toggle} className="w-12 h-12 rounded-2xl grid place-items-center transition-all"
            style={{ background: 'rgba(30,45,69,0.6)', border: '1px solid rgba(30,45,69,0.9)' }}
            aria-label={dark ? 'Switch to light' : 'Switch to dark'}>
            {dark ? <Sun size={20} style={{ color: 'hsl(38,92%,50%)' }} /> : <Moon size={20} style={{ color: 'hsl(217,91%,60%)' }} />}
          </button>
        </div>
      </Section>

      {/* Logout */}
      <button id="logout-btn" onClick={logout}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'hsl(0,84%,60%)' }}>
        <LogOut size={17} /> Log out
      </button>
    </main>
  );
}
