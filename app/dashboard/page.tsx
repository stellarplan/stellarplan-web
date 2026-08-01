'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Dashboard, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatRelative, iconFor } from '@/lib/format';
import { VaultCard } from '@/components/plans/VaultCard';
import { AllocationAnimation } from '@/components/plans/AllocationAnimation';
import { NumberTicker } from '@/components/common/NumberTicker';
import { FadeIn } from '@/components/common/FadeIn';
import { Plus, RefreshCw, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const d = await api.dashboard();
      setData(d);
    } catch (err: any) {
      setLoadError(err.message ?? 'Unable to load dashboard');
    }
  }

  async function handleScan() {
    if (!data?.user.walletAddress) return;
    setScanning(true);
    try {
      const result = await api.detectAllocations();
      if (result.paymentsProcessed > 0) {
        setAllocating(true);
      }
      await loadDashboard();
    } finally {
      setScanning(false);
    }
  }

  /* render */
  if (loadError) return <div className="p-8 text-danger">{loadError}</div>;
  if (!data) return <div className="p-8">Loading…</div>;

  const { user, balances, plans, vaults, recentTransactions, unreadNotifications } = data;
  const activeVaults = vaults.filter((v) => v.status === VaultStatus.LOCKED);
  const upcoming = activeVaults
    .filter((v) => v.unlockDate)
    .sort((a, b) => new Date(a.unlockDate!).getTime() - new Date(b.unlockDate!).getTime())
    .slice(0, 3);

  if (!user.walletAddress) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-sm space-y-4">
          <div className="text-5xl">🔗</div>
          <h1 className="text-3xl">Connect your wallet</h1>
          <p className="text-muted">Before StellarPlan can protect your salary, we need to know where it lands.</p>
          <Link href="/onboarding" className="btn-primary inline-block">Connect wallet</Link>
        </div>
      </main>
    );
  }

  if (plans.length === 0 && vaults.length === 0 && !allocating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-sm space-y-6">
          <div className="text-5xl">🌠</div>
          <h1 className="text-4xl">Welcome to StellarPlan.</h1>
          <p className="text-muted text-pretty">
            Let's build your first financial plan. Tell us which expenses your salary
            should always protect first.
          </p>
          <Link href="/budgets/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Create My First Plan
          </Link>
        </div>
      </main>
    );
  }

  /* show allocation animation while creating vaults */
  if (allocating) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <AllocationAnimation
          salary={recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount
            ? Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')!.amount)
            : 0}
          plans={plans}
          onComplete={() => { setAllocating(false); loadDashboard(); }}
        />
      </main>
    );
  }

  const available =
    Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount ?? 0) -
    balances.protected;

  return (
    <main className="min-h-screen pb-24 md:pb-8">
      {/* ------------------------------------------------ header */}
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-6 flex justify-between items-end">
        <div>
          <p className="text-muted text-sm">Good evening,</p>
          <h1 className="text-4xl">{user.name.split(' ')[0]}</h1>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="btn-ghost !p-3"
          title="Scan for new salary deposits"
        >
          <RefreshCw size={20} className={scanning ? 'animate-spin' : ''} />
        </button>
      </div>

      <FadeIn>
        {/* ------------------------------------------------ balances */}
        <section className="max-w-2xl mx-auto px-5 grid grid-cols-2 gap-4 mb-8">
          <div className="card !bg-surface !rounded-[24px]">
            <p className="text-muted text-xs uppercase tracking-widest font-semibold mb-2">Available</p>
            <p className="text-3xl font-semibold" data-balance>
              <NumberTicker value={available} />
            </p>
            <p className="text-muted text-xs mt-1">USDC</p>
          </div>
          <div className="card !bg-jade !border-jade text-white !rounded-[24px]">
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2">Protected</p>
            <p className="text-3xl font-semibold" data-balance>
              <NumberTicker value={balances.protected} />
            </p>
            <p className="text-white/70 text-xs mt-1">USDC auto-saved</p>
          </div>
        </section>
      </FadeIn>

      {/* ------------------------------------------------ protected progress */}
      {balances.planned > 0 && (
        <FadeIn>
          <section className="max-w-2xl mx-auto px-5 mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                {Math.min(100, Math.round((balances.protected / balances.planned) * 100))}% Protected
              </p>
              <p className="text-muted text-xs">
                {formatMoney(balances.protected)} of {formatMoney(balances.planned)} planned
              </p>
            </div>
            <div
              className="h-2.5 bg-clay/70 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(100, Math.round((balances.protected / balances.planned) * 100))}
              aria-label="Share of this month's plan already secured"
            >
              <div
                className="h-full rounded-full bg-jade transition-all duration-700"
                style={{ width: `${Math.min(100, (balances.protected / balances.planned) * 100)}%` }}
              />
            </div>
          </section>
        </FadeIn>
      )}

      {/* ------------------------------------------------ vault grid */}
      {activeVaults.length > 0 && (
        <section className="max-w-2xl mx-auto px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">My Plans <span className="text-muted text-sm font-normal">({activeVaults.length})</span></h2>
            <Link href="/budgets/new" className="text-jade text-sm font-semibold hover:underline">
              + New Plan
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {activeVaults.map((v) => <VaultCard key={v.id} vault={v} />)}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ upcoming unlocks */}
      {upcoming.length > 0 && (
        <section className="max-w-2xl mx-auto px-5 mb-8">
          <h2 className="text-lg mb-4">Upcoming Unlocks</h2>
          <div className="space-y-3">
            {upcoming.map((v) => (
              <div key={v.id} className="card flex items-center justify-between !py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{iconFor(v.category, v.budgetPlan?.icon)}</span>
                  <div>
                    <p className="font-semibold text-sm">{v.name}</p>
                    <p className="text-muted text-xs">Unlocks {v.unlockDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <span className="mono font-semibold" data-balance>{formatMoney(v.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ recent activity */}
      {recentTransactions.length > 0 && (
        <section className="max-w-2xl mx-auto px-5">
          <h2 className="text-lg mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {recentTransactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-3 border-b border-clay/40 last:border-0">
                <div className="w-10 h-10 rounded-full bg-clay/40 grid place-items-center text-lg flex-shrink-0">
                  {t.type === 'SALARY_DEPOSIT' ? '💵' : t.type === 'ALLOCATION' ? '🔀' : t.type === 'RELEASE' ? '🔓' : t.type === 'EARLY_WITHDRAWAL' ? '⚡' : '📥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.description ?? t.type}</p>
                  <p className="text-muted text-xs">{formatRelative(t.createdAt)}</p>
                </div>
                <span
                  className={`mono font-semibold text-sm ${t.type === 'SALARY_DEPOSIT' || t.type === 'RELEASE' ? 'text-success' : ''}`}
                  data-balance
                >
                  {t.type === 'ALLOCATION' ? '−' : '+'}{formatMoney(t.amount)}
                </span>
              </div>
            ))}
          </div>
          <Link href="/activity" className="text-jade text-sm font-semibold mt-4 block text-center">
            View all activity →
          </Link>
        </section>
      )}
    </main>
  );
}
