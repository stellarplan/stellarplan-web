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
    <section className="rounded-2xl mb-4 overflow-hidden bg-[#141519] border border-[#2B2C33]">
      <div className="px-6 py-4 border-b border-[#2B2C33]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">{title}</h2>
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
    <div className="p-8 text-center py-20 text-[#A1A1AA]">
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        Loading…
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-[#FAFAFA]" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      <p className="mb-8 text-sm text-[#A1A1AA]">Your account, wallet, and preferences.</p>

      {/* Account */}
      <Section title="Account">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <UserIcon size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#FAFAFA]">{user.name}</p>
            <p className="text-sm font-mono text-[#A1A1AA]">
              {user.walletAddress ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-6)}` : 'Wallet account'}
            </p>
            <p className="text-xs mt-1 text-[#71717A]">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Section>

      {/* Wallet */}
      <Section title="Connected Wallet">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Wallet size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm truncate text-emerald-400" style={{ fontFamily: 'var(--font-mono)' }}>{user.walletAddress ?? 'Not connected'}</p>
            <p className="text-xs text-[#71717A]">Stellar testnet</p>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-[#71717A]" />
            <span className="text-sm font-medium text-[#FAFAFA]">{notifications.filter(n => !n.read).length} unread</span>
          </div>
          {notifications.some((n) => !n.read) && (
            <button id="mark-all-read" className="text-xs font-bold hover:underline text-emerald-400"
              onClick={() => api.markAllNotificationsRead().then(() => api.notifications().then(setNotifications))}>
              Mark all read
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto scroll-fade">
          {notifications.length === 0 && <p className="text-sm text-[#A1A1AA]">No notifications yet.</p>}
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold"
                style={n.read ? { background: '#1C1D22', color: '#71717A' } : { background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                {n.read ? '✓' : '!'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: n.read ? '#A1A1AA' : '#FAFAFA' }}>{n.title}</p>
                <p className="text-xs mt-0.5 line-clamp-2 text-[#A1A1AA]">{n.message}</p>
                <p className="text-xs mt-1 text-[#71717A]">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-[#FAFAFA]">{dark ? 'Dark Mode' : 'Light Mode'}</p>
            <p className="text-xs mt-0.5 text-[#A1A1AA]">{dark ? 'Cyber Emerald &amp; Noir Graphite' : 'Light mode'}</p>
          </div>
          <button id="theme-toggle" onClick={toggle} className="w-12 h-12 rounded-2xl grid place-items-center transition-all bg-[#1C1D22] border border-[#2B2C33]"
            aria-label={dark ? 'Switch to light' : 'Switch to dark'}>
            {dark ? <Sun size={20} className="text-emerald-400" /> : <Moon size={20} className="text-emerald-400" />}
          </button>
        </div>
      </Section>

      {/* Logout */}
      <button id="logout-btn" onClick={logout}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-950/60">
        <LogOut size={17} /> Log out
      </button>
    </main>
  );
}
