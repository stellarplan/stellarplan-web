'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => router.replace('/login'));
  }, [router]);

  const short = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-6)}`
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'rgb(var(--background-rgb))' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-7 rounded-3xl p-8 bg-surface border border-border shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-accent">
            <Logo size={19} className="text-black" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground" style={{ fontFamily: 'var(--font-display)' }}>You&apos;re connected</h1>
            <p className="text-xs text-muted">Your Freighter wallet is linked to StellarPlan</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 space-y-2 bg-accent-soft border border-accent-line">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-text">
            <CheckCircle2 size={14} /> Wallet verified
          </div>
          {short && (
            <p className="text-xs font-mono break-all text-muted">{short}</p>
          )}
          <p className="text-xs text-muted leading-relaxed">
            StellarPlan watches this wallet for incoming salary and locks it into Soroban smart vaults according to your plans.
          </p>
        </div>

        <div className="rounded-2xl p-4 space-y-2 bg-surface-2 border border-border">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Shield size={14} className="text-accent-text" /> Next step
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Create your first budget plan — rent, bills, or savings — so StellarPlan knows how to split your salary.
          </p>
        </div>

        <div className="space-y-3">
          <button id="onboarding-create-plan-btn" onClick={() => router.push('/budgets/new')}
            className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl">
            <Plus size={18} /> Create Your First Plan
          </button>
          <button type="button" className="btn-ghost w-full py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2"
            onClick={() => router.push('/dashboard')}>
            Go to Dashboard <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
