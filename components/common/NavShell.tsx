'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Vault, BarChart3, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOTTOM_NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/plans', label: 'Plans', icon: Vault },
  { href: '/activity', label: 'Activity', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const SIDE_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/plans', label: 'Plans', icon: Vault },
  { href: '/activity', label: 'Activity', icon: BarChart3 },
  { href: '/budgets/new', label: 'New Plan', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="md:flex min-h-screen">
      {/* sidebar (desktop only) */}
      <aside className="hidden md:flex w-56 flex-col border-r border-clay/50 bg-surface/50 sticky top-0 h-screen p-6">
        <Link href="/dashboard" className="text-2xl font-bold mb-10 text-foreground/80">
          Stellar<span className="text-jade">Plan</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {SIDE_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition',
                pathname.startsWith(href)
                  ? 'bg-jade text-white shadow'
                  : 'text-muted hover:bg-clay/40 hover:text-foreground',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted/60 text-center">Plan once. Get paid. Stay protected.</p>
      </aside>

      {/* main content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* bottom nav (mobile only) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-clay/50 bg-surface backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 text-xs transition',
                pathname.startsWith(href) ? 'text-jade' : 'text-muted',
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
