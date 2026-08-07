'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Vault, BarChart3, Settings, Plus } from 'lucide-react';
import Logo from '@/components/common/Logo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

const BOTTOM_NAV = [
  { href: '/dashboard', label: 'Home',     icon: Home },
  { href: '/plans',     label: 'Plans',    icon: Vault },
  { href: '/activity',  label: 'Activity', icon: BarChart3 },
  { href: '/settings',  label: 'Settings', icon: Settings },
];

const SIDE_NAV = [
  { href: '/dashboard',   label: 'Dashboard', icon: Home },
  { href: '/plans',       label: 'Plans',      icon: Vault },
  { href: '/activity',    label: 'Activity',   icon: BarChart3 },
  { href: '/budgets/new', label: 'New Plan',   icon: Plus },
  { href: '/settings',    label: 'Settings',   icon: Settings },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="md:flex min-h-screen bg-background">

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 flex-col sticky top-0 h-screen bg-surface border-r border-border">

        {/* Logo */}
        <div className="px-6 py-6 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl grid place-items-center bg-accent">
              <Logo size={15} className="text-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'hsl(var(--foreground))' }}>
              Stellar<span style={{ color: 'rgb(var(--accent-rgb))' }}>Plan</span>
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {SIDE_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200')}
                style={active ? {
                  background: 'rgb(var(--accent-rgb) / 0.12)',
                  border: '1px solid rgb(var(--accent-rgb) / 0.5)',
                  color: 'hsl(var(--accent-text))',
                } : {
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'hsl(var(--muted))',
                }}
              >
                <Icon size={17} />
                {label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-border space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-muted-2">Appearance</span>
            <ThemeToggle />
          </div>
          <p className="text-xs text-center text-muted-2">Plan once. Get paid. Stay protected.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Floating theme toggle (mobile) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <ThemeToggle className="shadow-apple-card" />
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all relative"
                style={{ color: active ? 'hsl(var(--accent-text))' : 'hsl(var(--muted))' }}>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />
                )}
                <Icon size={21} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
