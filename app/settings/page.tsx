'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, Notification, setTokens } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { LogOut, Bell, Wallet, User as UserIcon } from 'lucide-react';
import { useTheme } from '@/app/providers';
import ThemeToggle from '@/components/common/ThemeToggle';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl mb-4 overflow-hidden bg-surface border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-2">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { theme } = useTheme();
  const dark = theme === 'dark';

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
    <div className="p-8 text-center py-20 text-muted">
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-accent-line border-t-emerald-500 animate-spin" />
        Loading…
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      <p className="mb-8 text-sm text-muted">Your account, wallet, and preferences.</p>

      {/* Account */}
      <Section title="Account">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-accent-soft border border-accent-line text-accent-text">
            <UserIcon size={22} />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm font-mono text-muted">
              {user.walletAddress ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-6)}` : 'Wallet account'}
            </p>
            <p className="text-xs mt-1 text-muted-2">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Section>

      {/* Wallet */}
      <Section title="Connected Wallet">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-accent-soft border border-accent-line text-accent-text">
            <Wallet size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm truncate text-accent-text" style={{ fontFamily: 'var(--font-mono)' }}>{user.walletAddress ?? 'Not connected'}</p>
            <p className="text-xs text-muted-2">Stellar testnet</p>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-muted-2" />
            <span className="text-sm font-medium text-foreground">{notifications.filter(n => !n.read).length} unread</span>
          </div>
          {notifications.some((n) => !n.read) && (
            <button id="mark-all-read" className="text-xs font-bold hover:underline text-accent-text"
              onClick={() => api.markAllNotificationsRead().then(() => api.notifications().then(setNotifications))}>
              Mark all read
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto scroll-fade">
          {notifications.length === 0 && <p className="text-sm text-muted">No notifications yet.</p>}
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold"
                style={n.read ? { background: 'rgb(var(--surface-2-rgb))', color: 'hsl(var(--muted-2))' } : { background: 'rgb(var(--accent-rgb) / 0.15)', color: 'rgb(var(--accent-rgb))', border: '1px solid rgb(var(--accent-rgb) / 0.3)' }}>
                {n.read ? '✓' : '!'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: n.read ? 'hsl(var(--muted))' : 'hsl(var(--foreground))' }}>{n.title}</p>
                <p className="text-xs mt-0.5 line-clamp-2 text-muted">{n.message}</p>
                <p className="text-xs mt-1 text-muted-2">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm text-foreground">{dark ? 'Dark Mode' : 'Light Mode'}</p>
            <p className="text-xs mt-0.5 text-muted">{dark ? 'Cyber Emerald & Noir Graphite' : 'Cyber Emerald & Soft Light'}</p>
          </div>
          <ThemeToggle variant="segmented" />
        </div>
      </Section>

      {/* Logout */}
      <button id="logout-btn" onClick={logout}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-danger-soft border border-danger-line text-danger-text hover:bg-danger-soft">
        <LogOut size={17} /> Log out
      </button>
    </main>
  );
}
