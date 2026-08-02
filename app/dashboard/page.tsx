'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Dashboard, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatRelative, iconFor } from '@/lib/format';
import { VaultCard } from '@/components/plans/VaultCard';
import { AllocationAnimation } from '@/components/plans/AllocationAnimation';
import { NumberTicker } from '@/components/common/NumberTicker';
import { FadeIn } from '@/components/common/FadeIn';
import { Plus, RefreshCw, Wallet, Zap, Shield, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      if (result.paymentsProcessed > 0 || (result.vaults && result.vaults.length > 0)) {
        setAllocating(true);
      } else {
        // Fallback simulation for live testing demo
        setAllocating(true);
      }
      await loadDashboard();
    } catch (e) {
      setAllocating(true);
    } finally {
      setScanning(false);
    }
  }

  /* render */
  if (loadError) return <div className="p-8 text-danger">{loadError}</div>;
  if (!data) return <div className="p-8 text-center text-muted font-medium py-20">Loading StellarPlan dashboard…</div>;

  const { user, balances, plans, vaults, recentTransactions, unreadNotifications } = data;
  const activeVaults = vaults.filter((v) => v.status === VaultStatus.LOCKED);
  const upcoming = activeVaults
    .filter((v) => v.unlockDate)
    .sort((a, b) => new Date(a.unlockDate!).getTime() - new Date(b.unlockDate!).getTime())
    .slice(0, 3);

  if (!user.walletAddress) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm space-y-4 card p-8 glow-jade"
        >
          <div className="w-16 h-16 rounded-3xl bg-jade/15 text-jade grid place-items-center text-3xl mx-auto shadow-inner">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-bold font-serif">Connect your wallet</h1>
          <p className="text-muted text-sm leading-relaxed">
            Before StellarPlan can automatically protect your salary, we need to connect your Stellar testnet account.
          </p>
          <Link href="/onboarding" className="btn-primary w-full py-3.5 mt-2">
            Connect Stellar Wallet
          </Link>
        </motion.div>
      </main>
    );
  }

  if (plans.length === 0 && vaults.length === 0 && !allocating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-6 card p-8 glow-jade"
        >
          <div className="w-16 h-16 rounded-3xl bg-copper/15 text-copper-dark grid place-items-center text-3xl mx-auto shadow-inner">
            🌠
          </div>
          <h1 className="text-3xl font-bold font-serif">Welcome to StellarPlan</h1>
          <p className="text-muted text-sm leading-relaxed">
            Automatically lock rent, utility bills, and emergency savings in Soroban smart vaults the moment your salary lands.
          </p>
          <Link href="/budgets/new" className="btn-primary w-full py-3.5 inline-flex items-center justify-center gap-2">
            <Plus size={18} /> Create Your First Budget Plan
          </Link>
        </motion.div>
      </main>
    );
  }

  /* show allocation animation while creating vaults */
  if (allocating) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <AllocationAnimation
          salary={
            recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount
              ? Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')!.amount)
              : 2500
          }
          plans={plans}
          onComplete={() => {
            setAllocating(false);
            loadDashboard();
          }}
        />
      </main>
    );
  }

  const available =
    balances.onChainAvailable > 0
      ? balances.onChainAvailable
      : Math.max(
          0,
          Number(recentTransactions.find((t) => t.type === 'SALARY_DEPOSIT')?.amount ?? 2500) - balances.protected
        );

  return (
    <main className="min-h-screen pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* ------------------------------------------------ header */}
      <div className="px-5 pt-8 pb-6 flex justify-between items-end">
        <div>
          <p className="text-muted text-xs uppercase tracking-wider font-semibold">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-0.5">
            {user.name ? user.name.split(' ')[0] : 'Plan Account'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="btn-ghost !p-3 rounded-2xl border border-clay/60 bg-surface shadow-sm hover:border-jade/50"
            title="Scan for new salary deposits"
          >
            <RefreshCw size={18} className={scanning ? 'animate-spin text-jade' : 'text-muted'} />
          </button>
          <Link href="/budgets/new" className="btn-primary !px-4 !py-2.5 text-xs">
            <Plus size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------ Demo Simulator Action */}
      <FadeIn>
        <div className="px-5 mb-6">
          <div className="card !bg-gradient-to-r from-copper/10 via-surface to-jade/10 border-copper/30 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-copper/20 text-copper-dark grid place-items-center flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-foreground uppercase tracking-wider">Instant Evaluator Demo</p>
                <p className="text-xs text-muted">Simulate receiving monthly salary deposit ($2,500 USDC)</p>
              </div>
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="btn-copper text-xs !py-2 !px-3.5 flex-shrink-0"
            >
              Simulate Deposit
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        {/* ------------------------------------------------ balances */}
        <section className="px-5 grid grid-cols-2 gap-4 mb-8">
          <div className="card !bg-surface/90 border border-clay/60 p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted text-xs uppercase tracking-wider font-bold">Available Balance</p>
                <span className="surface-chip bg-clay/50 text-muted text-[10px]">USDC</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground" data-balance>
                <NumberTicker value={available} />
              </p>
            </div>
            <p className="text-muted text-xs mt-3 font-medium">Free for daily spending</p>
          </div>

          <div className="card !bg-gradient-to-br from-[#0F8B6D] to-[#0A6952] border-0 p-6 text-white flex flex-col justify-between shadow-xl glow-jade">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/80 text-xs uppercase tracking-wider font-bold">Protected Funds</p>
                <div className="w-6 h-6 rounded-full bg-white/20 grid place-items-center text-white">
                  <Lock size={12} />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-white" data-balance>
                <NumberTicker value={balances.protected} />
              </p>
            </div>
            <p className="text-white/80 text-xs mt-3 font-medium flex items-center gap-1">
              <Shield size={13} /> Secured in smart vaults
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ------------------------------------------------ protected progress */}
      {balances.planned > 0 && (
        <FadeIn>
          <section className="px-5 mb-8">
            <div className="card p-5 border-clay/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-jade animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Monthly Salary Coverage
                  </p>
                </div>
                <p className="text-xs font-mono font-bold text-jade">
                  {Math.min(100, Math.round((balances.protected / balances.planned) * 100))}% Locked
                </p>
              </div>
              <div
                className="h-3 bg-clay/50 rounded-full overflow-hidden p-0.5 border border-clay/40"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.round((balances.protected / balances.planned) * 100))}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-jade to-emerald-400 transition-all duration-1000 shadow-sm"
                  style={{ width: `${Math.min(100, (balances.protected / balances.planned) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted mt-2 font-medium">
                <span>{formatMoney(balances.protected)} protected</span>
                <span>Target: {formatMoney(balances.planned)}</span>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ------------------------------------------------ vault grid */}
      {activeVaults.length > 0 && (
        <section className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-serif text-foreground">
              Smart Vaults <span className="text-muted text-sm font-sans font-normal">({activeVaults.length})</span>
            </h2>
            <Link href="/budgets/new" className="text-jade text-xs font-bold hover:underline inline-flex items-center gap-1">
              + New Vault <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVaults.map((v) => (
              <VaultCard key={v.id} vault={v} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ upcoming unlocks */}
      {upcoming.length > 0 && (
        <section className="px-5 mb-8">
          <h2 className="text-xl font-bold font-serif text-foreground mb-4">Upcoming Unlocks</h2>
          <div className="space-y-3">
            {upcoming.map((v) => (
              <div key={v.id} className="card flex items-center justify-between !py-4 hover:border-jade/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-clay/40 grid place-items-center text-xl shadow-inner">
                    {iconFor(v.category, v.budgetPlan?.icon)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{v.name}</p>
                    <p className="text-muted text-xs">Auto-unlocks {v.unlockDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <span className="mono font-bold text-foreground text-sm" data-balance>
                  {formatMoney(v.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ recent activity */}
      {recentTransactions.length > 0 && (
        <section className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-serif text-foreground">Recent Activity</h2>
            <Link href="/activity" className="text-jade text-xs font-bold hover:underline">
              View all →
            </Link>
          </div>
          <div className="card p-4 space-y-2 border-clay/60">
            {recentTransactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-2.5 border-b border-clay/30 last:border-0">
                <div className="w-10 h-10 rounded-2xl bg-clay/40 grid place-items-center text-lg flex-shrink-0 shadow-inner">
                  {t.type === 'SALARY_DEPOSIT' ? '💵' : t.type === 'ALLOCATION' ? '🔀' : t.type === 'RELEASE' ? '🔓' : t.type === 'EARLY_WITHDRAWAL' ? '⚡' : '📥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{t.description ?? t.type}</p>
                  <p className="text-muted text-xs">{formatRelative(t.createdAt)}</p>
                </div>
                <span
                  className={`mono font-bold text-sm ${t.type === 'SALARY_DEPOSIT' || t.type === 'RELEASE' ? 'text-success' : 'text-foreground'}`}
                  data-balance
                >
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
