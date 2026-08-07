'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Dashboard, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatRelative, iconFor } from '@/lib/format';
import { VaultCard } from '@/components/plans/VaultCard';
import { AllocationAnimation } from '@/components/plans/AllocationAnimation';
import { NumberTicker } from '@/components/common/NumberTicker';
import { FadeIn } from '@/components/common/FadeIn';
import { Plus, RefreshCw, Wallet, Zap, Shield, ArrowUpRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try { setData(await api.dashboard()); }
    catch (err: any) { setLoadError(err.message ?? 'Unable to load dashboard'); }
  }

  async function handleScan() {
    if (!data?.user.walletAddress) return;
    setScanning(true);
    try {
      const result = await api.detectAllocations();
      if (result.paymentsProcessed > 0) setAllocating(true);
      await loadDashboard();
    } catch (err: any) {
      setLoadError(err?.message ?? 'Scan failed');
    } finally { setScanning(false); }
  }

  if (loadError) return (
    <div className="p-8 text-center">
      <p className="text-danger-text">{loadError}</p>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center py-20 text-muted">
      <div className="inline-flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-accent-line border-t-emerald-500 animate-spin" />
        Loading StellarPlan…
      </div>
    </div>
  );

  const { user, balances, plans, vaults, recentTransactions } = data;
  const activeVaults = vaults.filter((v) => v.status === VaultStatus.LOCKED);
  const upcoming = activeVaults
    .filter((v) => v.unlockDate)
    .sort((a, b) => new Date(a.unlockDate!).getTime() - new Date(b.unlockDate!).getTime())
    .slice(0, 3);

  // Connect wallet prompt
  if (!user.walletAddress) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm text-center space-y-5 rounded-2xl p-10 bg-surface border border-border">
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-accent-soft border border-accent-line text-accent-text">
          <Wallet size={28} />
        </div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Connect your wallet</h1>
        <p className="text-sm leading-relaxed text-muted">Before StellarPlan can protect your salary, connect your Stellar testnet account.</p>
        <Link href="/onboarding" className="btn-primary w-full py-3.5">Connect Stellar Wallet</Link>
      </motion.div>
    </main>
  );

  // Empty state
  if (plans.length === 0 && vaults.length === 0 && !allocating) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center space-y-6 rounded-2xl p-10 bg-surface border border-border">
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto text-3xl bg-accent-soft border border-accent-line">🌠</div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Welcome to StellarPlan</h1>
        <p className="text-sm leading-relaxed text-muted">
          Automatically lock rent, utility bills, and emergency savings in Soroban smart vaults the moment your salary lands.
        </p>
        <Link href="/budgets/new" className="btn-primary w-full py-3.5 inline-flex items-center justify-center gap-2">
          <Plus size={18} /> Create Your First Budget Plan
        </Link>
      </motion.div>
    </main>
  );

  // Allocation animation
  if (allocating) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--background-rgb))' }}>
      <AllocationAnimation
        salary={Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount ?? 0)}
        plans={plans}
        onComplete={() => { setAllocating(false); loadDashboard(); }}
      />
    </main>
  );

  const available = balances.onChainAvailable;

  const protectedPct = balances.planned > 0 ? Math.min(100, Math.round((balances.protected / balances.planned) * 100)) : 0;

  return (
    <main className="min-h-screen pb-24 md:pb-12 max-w-3xl mx-auto">

      {/* Header */}
      <div className="px-5 pt-8 pb-6 flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold mb-1 text-muted-2">Welcome back</p>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            {user.name ? user.name.split(' ')[0] : 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleScan} disabled={scanning} id="dashboard-scan"
            className="btn-ghost !p-3 rounded-2xl" title="Scan for new salary deposits">
            <RefreshCw size={18} className={scanning ? 'animate-spin' : ''} style={{ color: scanning ? 'rgb(var(--accent-rgb))' : 'hsl(var(--muted))' }} />
          </button>
          <Link href="/budgets/new" id="new-plan-btn" className="btn-primary !px-4 !py-2.5 text-xs rounded-xl">
            <Plus size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* Scan for deposits */}
      <FadeIn>
        <div className="px-5 mb-6">
          <div className="rounded-2xl p-4 flex items-center justify-between gap-4 bg-accent-soft border border-accent-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 bg-accent-soft border border-accent-line text-accent-text">
                <Zap size={19} />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-foreground">Check for Salary</p>
                <p className="text-xs text-muted">Scan your wallet on Stellar for new incoming USDC to allocate.</p>
              </div>
            </div>
            <button onClick={handleScan} disabled={scanning} id="scan-deposits"
              className="btn-primary text-xs !py-2 !px-4 flex-shrink-0 rounded-xl disabled:opacity-50">
              {scanning ? 'Scanning…' : 'Scan Now'}
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Balance Cards */}
      <FadeIn>
        <section className="px-5 grid grid-cols-2 gap-4 mb-6">
          {/* Available */}
          <div className="rounded-2xl p-6 flex flex-col justify-between bg-surface border border-border">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold text-muted-2">Available</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-muted">USDC</span>
              </div>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
                $<NumberTicker value={available} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium text-muted-2">Free for daily spending</p>
          </div>

          {/* Protected */}
          <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden bg-accent-soft border border-accent-line">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold text-accent-text/70">Protected</p>
                <div className="w-6 h-6 rounded-full grid place-items-center bg-accent-soft">
                  <Lock size={12} className="text-accent-text" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
                $<NumberTicker value={balances.protected} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium flex items-center gap-1.5 text-accent-text/70">
              <Shield size={12} /> Secured in smart vaults
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Progress bar */}
      {balances.planned > 0 && (
        <FadeIn>
          <section className="px-5 mb-6">
            <div className="rounded-2xl p-5 bg-surface border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">Monthly Salary Coverage</p>
                </div>
                <p className="text-xs font-mono font-bold text-accent-text">{protectedPct}% Locked</p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-surface-2">
                <div className="h-full rounded-full transition-all duration-1000 bg-accent"
                  style={{ width: `${(balances.protected / balances.planned) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 font-medium text-muted-2">
                <span>{formatMoney(balances.protected)} protected</span>
                <span>Target: {formatMoney(balances.planned)}</span>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* Active Vaults */}
      {activeVaults.length > 0 && (
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Smart Vaults <span className="text-sm font-normal text-muted-2">({activeVaults.length})</span>
            </h2>
            <Link href="/budgets/new" className="text-xs font-bold inline-flex items-center gap-1 hover:underline text-accent-text">
              + New Vault <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVaults.map((v) => <VaultCard key={v.id} vault={v} />)}
          </div>
        </section>
      )}

      {/* Upcoming Unlocks */}
      {upcoming.length > 0 && (
        <section className="px-5 mb-6">
          <h2 className="mb-4 text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Upcoming Unlocks</h2>
          <div className="space-y-2.5">
            {upcoming.map((v) => (
              <div key={v.id} className="rounded-2xl px-5 py-4 flex items-center justify-between bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl bg-surface-2">
                    {iconFor(v.category, v.budgetPlan?.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-2">Auto-unlocks {v.unlockDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-foreground" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
                  {formatMoney(v.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {recentTransactions.length > 0 && (
        <section className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
            <Link href="/activity" className="text-xs font-bold hover:underline text-accent-text">View all →</Link>
          </div>
          <div className="rounded-2xl overflow-hidden bg-surface border border-border">
            {recentTransactions.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < 4 ? '1px solid rgb(var(--border-rgb))' : 'none' }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center text-lg flex-shrink-0 bg-surface-2">
                  {t.type === 'SALARY_DEPOSIT' ? '💵' : t.type === 'ALLOCATION' ? '🔀' : t.type === 'RELEASE' ? '🔓' : t.type === 'EARLY_WITHDRAWAL' ? '⚡' : '📥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">{t.description ?? t.type}</p>
                  <p className="text-xs text-muted-2">{formatRelative(t.createdAt)}</p>
                </div>
                <span className="font-mono font-bold text-sm" data-balance
                  style={{ color: t.type === 'SALARY_DEPOSIT' || t.type === 'RELEASE' ? 'rgb(var(--accent-rgb))' : 'hsl(var(--foreground))', fontFamily: 'var(--font-mono)' }}>
                  {t.type === 'ALLOCATION' ? '−' : '+'}{formatMoney(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
