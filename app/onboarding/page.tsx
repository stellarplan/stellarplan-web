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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0C0D10' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-7 rounded-3xl p-8 bg-[#141519] border border-[#2B2C33] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-emerald-500">
            <Logo size={19} className="text-black" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#FAFAFA]" style={{ fontFamily: 'var(--font-display)' }}>You&apos;re connected</h1>
            <p className="text-xs text-[#A1A1AA]">Your Freighter wallet is linked to StellarPlan</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 space-y-2 bg-emerald-950/40 border border-emerald-800">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 size={14} /> Wallet verified
          </div>
          {short && (
            <p className="text-xs font-mono break-all text-[#A1A1AA]">{short}</p>
          )}
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            StellarPlan watches this wallet for incoming salary and locks it into Soroban smart vaults according to your plans.
          </p>
        </div>

        <div className="rounded-2xl p-4 space-y-2 bg-[#1C1D22] border border-[#2B2C33]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FAFAFA]">
            <Shield size={14} className="text-emerald-400" /> Next step
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
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
