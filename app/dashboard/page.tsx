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
      <p style={{ color: 'hsl(0,84%,60%)' }}>{loadError}</p>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center py-20" style={{ color: 'hsl(222,22%,55%)' }}>
      <div className="inline-flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-stellar border-t-transparent animate-spin" style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: 'hsl(217,91%,60%)' }} />
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
        className="max-w-sm text-center space-y-5 rounded-2xl p-10"
        style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Wallet size={28} style={{ color: 'hsl(217,91%,60%)' }} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Connect your wallet</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'hsl(222,22%,55%)' }}>Before StellarPlan can protect your salary, connect your Stellar testnet account.</p>
        <Link href="/onboarding" className="btn-primary w-full py-3.5">Connect Stellar Wallet</Link>
      </motion.div>
    </main>
  );

  // Empty state
  if (plans.length === 0 && vaults.length === 0 && !allocating) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center space-y-6 rounded-2xl p-10"
        style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.8)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto text-3xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(59,130,246,0.25)' }}>🌠</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Welcome to StellarPlan</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'hsl(222,22%,55%)' }}>
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
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(8,11,18)' }}>
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
          <p className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: 'hsl(222,22%,45%)' }}>Welcome back</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
            {user.name ? user.name.split(' ')[0] : 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleScan} disabled={scanning} id="dashboard-scan"
            className="btn-ghost !p-3 rounded-2xl" title="Scan for new salary deposits"
            style={{ border: '1px solid rgba(30,45,69,0.8)' }}>
            <RefreshCw size={18} className={scanning ? 'animate-spin' : ''} style={{ color: scanning ? 'hsl(217,91%,60%)' : 'hsl(222,22%,55%)' }} />
          </button>
          <Link href="/budgets/new" id="new-plan-btn" className="btn-primary !px-4 !py-2.5 text-xs rounded-xl">
            <Plus size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* Demo Simulator */}
      <FadeIn>
        <div className="px-5 mb-6">
          <div className="rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Zap size={19} style={{ color: 'hsl(38,92%,50%)' }} />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider" style={{ color: 'hsl(228,60%,93%)' }}>Instant Evaluator Demo</p>
                <p className="text-xs" style={{ color: 'hsl(222,22%,50%)' }}>Simulate receiving monthly salary deposit ($2,500 USDC)</p>
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
          <div className="rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.8)' }}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'hsl(222,22%,45%)' }}>Available</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(30,45,69,0.8)', color: 'hsl(222,22%,55%)' }}>USDC</span>
              </div>
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'hsl(228,60%,93%)' }} data-balance>
                $<NumberTicker value={available} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium" style={{ color: 'hsl(222,22%,45%)' }}>Free for daily spending</p>
          </div>

          {/* Protected */}
          <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1a2d4d 60%, #131E35 100%)', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 40px rgba(59,130,246,0.12)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Protected</p>
                <div className="w-6 h-6 rounded-full grid place-items-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Lock size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'white' }} data-balance>
                $<NumberTicker value={balances.protected} />
              </p>
            </div>
            <p className="text-xs mt-3 font-medium flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Shield size={12} /> Secured in smart vaults
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Progress bar */}
      {balances.planned > 0 && (
        <FadeIn>
          <section className="px-5 mb-6">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(217,91%,60%)' }} />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'hsl(228,60%,80%)' }}>Monthly Salary Coverage</p>
                </div>
                <p className="text-xs font-mono font-bold" style={{ color: 'hsl(217,91%,60%)' }}>{protectedPct}% Locked</p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,45,69,0.8)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(balances.protected / balances.planned) * 100}%`, background: 'linear-gradient(90deg, #3B82F6, #7C3AED)' }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 font-medium" style={{ color: 'hsl(222,22%,50%)' }}>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
              Smart Vaults <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'hsl(222,22%,50%)' }}>({activeVaults.length})</span>
            </h2>
            <Link href="/budgets/new" className="text-xs font-bold inline-flex items-center gap-1 hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>
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
          <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Upcoming Unlocks</h2>
          <div className="space-y-2.5">
            {upcoming.map((v) => (
              <div key={v.id} className="rounded-2xl px-5 py-4 flex items-center justify-between transition-colors"
                style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ background: 'rgba(30,45,69,0.8)' }}>
                    {iconFor(v.category, v.budgetPlan?.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'hsl(228,60%,93%)' }}>{v.name}</p>
                    <p className="text-xs" style={{ color: 'hsl(222,22%,50%)' }}>Auto-unlocks {v.unlockDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm" style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }} data-balance>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
            <Link href="/activity" className="text-xs font-bold hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>View all →</Link>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}>
            {recentTransactions.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < 4 ? '1px solid rgba(30,45,69,0.5)' : 'none' }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center text-lg flex-shrink-0" style={{ background: 'rgba(30,45,69,0.8)' }}>
                  {t.type === 'SALARY_DEPOSIT' ? '💵' : t.type === 'ALLOCATION' ? '🔀' : t.type === 'RELEASE' ? '🔓' : t.type === 'EARLY_WITHDRAWAL' ? '⚡' : '📥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'hsl(228,60%,93%)' }}>{t.description ?? t.type}</p>
                  <p className="text-xs" style={{ color: 'hsl(222,22%,50%)' }}>{formatRelative(t.createdAt)}</p>
                </div>
                <span className="font-mono font-bold text-sm" data-balance
                  style={{ color: t.type === 'SALARY_DEPOSIT' || t.type === 'RELEASE' ? 'hsl(189,95%,43%)' : 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }}>
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
