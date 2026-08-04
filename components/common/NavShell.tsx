'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Vault, BarChart3, Settings, Plus, Star } from 'lucide-react';
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
    <div className="md:flex min-h-screen" style={{ background: 'rgb(8,11,18)' }}>

      {/* ━━ Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 flex-col sticky top-0 h-screen"
        style={{ background: 'rgba(14,20,32,0.95)', borderRight: '1px solid rgba(30,45,69,0.7)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="px-6 py-6 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl grid place-items-center transition-all duration-300 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', boxShadow: '0 0 16px rgba(59,130,246,0.35)' }}>
              <Star size={15} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'hsl(228,60%,93%)' }}>
              Stellar<span style={{ color: 'hsl(217,91%,60%)' }}>Plan</span>
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {SIDE_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200', active ? '' : '')}
                style={active ? {
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: 'hsl(217,91%,60%)',
                } : {
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'hsl(222,22%,55%)',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(30,45,69,0.6)'; e.currentTarget.style.color = 'hsl(228,60%,93%)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(222,22%,55%)'; } }}
              >
                <Icon size={17} />
                {label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(217,91%,60%)' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5">
          <p className="text-xs text-center" style={{ color: 'hsl(222,22%,35%)' }}>Plan once. Get paid. Stay protected.</p>
        </div>
      </aside>

      {/* ━━ Main Content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* ━━ Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]"
        style={{ background: 'rgba(8,11,18,0.95)', borderTop: '1px solid rgba(30,45,69,0.7)', backdropFilter: 'blur(20px)' }}>
        <div className="grid grid-cols-4">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200 relative"
                style={{ color: active ? 'hsl(217,91%,60%)' : 'hsl(222,22%,45%)' }}>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: 'hsl(217,91%,60%)' }} />
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
