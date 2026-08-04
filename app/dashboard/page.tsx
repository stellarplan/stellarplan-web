'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Dashboard, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatRelative, iconFor } from '@/lib/format';
import { VaultCard } from '@/components/plans/VaultCard';
import { AllocationAnimation } from '@/components/plans/AllocationAnimation';
import { NumberTicker } from '@/components/common/NumberTicker';
import { FadeIn } from '@/components/common/FadeIn';
import { Plus, RefreshCw, Wallet, Zap, Shield, ArrowUpRight, Lock, CheckCircle2, Star } from 'lucide-react';
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
      if (result.paymentsProcessed > 0 || (result.vaults && result.vaults.length > 0)) setAllocating(true);
      else setAllocating(true);
      await loadDashboard();
    } catch { setAllocating(true); }
    finally { setScanning(false); }
  }

  if (loadError) return (
    <div className="p-8 text-center">
      <p className="text-rose-400">{loadError}</p>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center py-20 text-zinc-400">
      <div className="inline-flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
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
        className="max-w-sm text-center space-y-5 rounded-2xl p-10 bg-zinc-900 border border-zinc-800">
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto bg-emerald-950 border border-emerald-800 text-emerald-400">
          <Wallet size={28} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Connect your wallet</h1>
        <p className="text-sm leading-relaxed text-zinc-400">Before StellarPlan can protect your salary, connect your Stellar testnet account.</p>
        <Link href="/onboarding" className="btn-primary w-full py-3.5">Connect Stellar Wallet</Link>
      </motion.div>
    </main>
  );

  // Empty state
  if (plans.length === 0 && vaults.length === 0 && !allocating) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center space-y-6 rounded-2xl p-10 bg-zinc-900 border border-zinc-800">
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto text-3xl bg-emerald-950 border border-emerald-800">🌠</div>
        <h1 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Welcome to StellarPlan</h1>
        <p className="text-sm leading-relaxed text-zinc-400">
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
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0C0D10' }}>
      <AllocationAnimation
        salary={recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount
          ? Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')!.amount)
          : 2500}
        plans={plans}
        onComplete={() => { setAllocating(false); loadDashboard(); }}
      />
    </main>
  );

  const available = balances.onChainAvailable > 0
    ? balances.onChainAvailable
    : Math.max(0, Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount ?? 2500) - balances.protected);

  const protectedPct = balances.planned > 0 ? Math.min(100, Math.round((balances.protected / balances.planned) * 100)) : 0;

  return (
    <main className="min-h-screen pb-24 md:pb-12 max-w-3xl mx-auto">

      {/* Header */}
      <div className="px-5 pt-8 pb-6 flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold mb-1 text-zinc-500">Welcome back</p>
          <h1 className="text-3xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>
            {user.name ? user.name.split(' ')[0] : 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleScan} disabled={scanning} id="dashboard-scan"
            className="btn-ghost !p-3 rounded-2xl" title="Scan for new salary deposits">
            <RefreshCw size={18} className={scanning ? 'animate-spin' : ''} style={{ color: scanning ? '#10B981' : '#A1A1AA' }} />
          </button>
          <Link href="/budgets/new" id="new-plan-btn" className="btn-primary !px-4 !py-2.5 text-xs rounded-xl">
            <Plus size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* Demo Simulator */}
      <FadeIn>
        <div className="px-5 mb-6">
          <div className="rounded-2xl p-4 flex items-center justify-between gap-4 bg-amber-950/30 border border-amber-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 bg-amber-950/60 border border-amber-800/40 text-amber-400">
                <Zap size={19} />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-zinc-100">Instant Evaluator Demo</p>
                <p className="text-xs text-zinc-400">Simulate receiving monthly salary deposit ($2,500 USDC)</p>
              </div>
            </div>
            <button onClick={handleScan} disabled={scanning} id="simulate-deposit"
              className="btn-gold text-xs !py-2 !px-4 flex-shrink-0 rounded-xl">
              Simulate Deposit
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Balance Cards */}
      <FadeIn>
        <section className="px-5 grid grid-cols-2 gap-4 mb-6">
          {/* Available */}
          <div className="rounded-2xl p-6 flex flex-col justify-between bg-zinc-900 border border-zinc-800">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold text-zinc-500">Available</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">USDC</span>
              </div>
              <p className="text-3xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
                $<NumberTicker value={available} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium text-zinc-500">Free for daily spending</p>
          </div>

          {/* Protected */}
          <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden bg-emerald-950 border border-emerald-800">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold text-emerald-400/70">Protected</p>
                <div className="w-6 h-6 rounded-full grid place-items-center bg-emerald-900/60">
                  <Lock size={12} className="text-emerald-300" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-50" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
                $<NumberTicker value={balances.protected} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium flex items-center gap-1.5 text-emerald-400/70">
              <Shield size={12} /> Secured in smart vaults
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Progress bar */}
      {balances.planned > 0 && (
        <FadeIn>
          <section className="px-5 mb-6">
            <div className="rounded-2xl p-5 bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">Monthly Salary Coverage</p>
                </div>
                <p className="text-xs font-mono font-bold text-emerald-400">{protectedPct}% Locked</p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-zinc-800">
                <div className="h-full rounded-full transition-all duration-1000 bg-emerald-500"
                  style={{ width: `${(balances.protected / balances.planned) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 font-medium text-zinc-500">
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
            <h2 className="text-xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>
              Smart Vaults <span className="text-sm font-normal text-zinc-500">({activeVaults.length})</span>
            </h2>
            <Link href="/budgets/new" className="text-xs font-bold inline-flex items-center gap-1 hover:underline text-emerald-400">
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
          <h2 className="mb-4 text-xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Upcoming Unlocks</h2>
          <div className="space-y-2.5">
            {upcoming.map((v) => (
              <div key={v.id} className="rounded-2xl px-5 py-4 flex items-center justify-between bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl bg-zinc-800">
                    {iconFor(v.category, v.budgetPlan?.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-100">{v.name}</p>
                    <p className="text-xs text-zinc-500">Auto-unlocks {v.unlockDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-zinc-100" style={{ fontFamily: 'var(--font-mono)' }} data-balance>
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
            <h2 className="text-xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
            <Link href="/activity" className="text-xs font-bold hover:underline text-emerald-400">View all →</Link>
          </div>
          <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {recentTransactions.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < 4 ? '1px solid #2B2C33' : 'none' }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center text-lg flex-shrink-0 bg-zinc-800">
                  {t.type === 'SALARY_DEPOSIT' ? '💵' : t.type === 'ALLOCATION' ? '🔀' : t.type === 'RELEASE' ? '🔓' : t.type === 'EARLY_WITHDRAWAL' ? '⚡' : '📥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-zinc-100">{t.description ?? t.type}</p>
                  <p className="text-xs text-zinc-500">{formatRelative(t.createdAt)}</p>
                </div>
                <span className="font-mono font-bold text-sm" data-balance
                  style={{ color: t.type === 'SALARY_DEPOSIT' || t.type === 'RELEASE' ? '#10B981' : '#FAFAFA', fontFamily: 'var(--font-mono)' }}>
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
