'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isFreighterAvailable, loginWithFreighter } from '@/lib/freighter';
import { ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Zap, Wallet } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isFreighterAvailable().then(setAvailable);
  }, []);

  async function handleFreighterAuth() {
    setError(''); setBusy(true);
    try {
      await loginWithFreighter();
      // First successful signature creates the account server-side.
      router.push('/onboarding');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : err?.message ?? 'Freighter connection failed or was rejected');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'rgb(var(--background-rgb))' }}>

      {/* Left Branding */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative bg-surface border-r border-border">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-accent">
              <Logo size={17} className="text-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--foreground))' }}>
              Stellar<span style={{ color: 'rgb(var(--accent-rgb))' }}>Plan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-soft border border-accent-line text-accent-text">
            <Shield size={13} /> Non-Custodial Salary Vaults
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>
            Protect Your Paycheck with Soroban Smart Contracts.
          </h2>
          <p style={{ color: 'hsl(var(--muted))', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Connect your Freighter wallet and sign in — your account is created the first time you sign. No email, no password.
          </p>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4 text-muted-2">
          <span>© 2026 StellarPlan</span>
          <span>•</span>
          <span>Stellar Testnet</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-accent">
              <Logo size={17} className="text-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--foreground))' }}>
              Stellar<span style={{ color: 'rgb(var(--accent-rgb))' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>Create Your Account</h1>
            <p className="mt-1.5 text-sm text-muted">Connect Freighter and sign to get started.</p>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-danger-soft border border-danger-line text-danger-text">
              {error}
            </div>
          )}

          <div className="space-y-5 rounded-2xl p-8 bg-surface border border-border">
            {available === false && (
              <div className="rounded-xl p-4 text-center space-y-2 bg-accent-soft border border-accent-line">
                <p className="text-xs font-semibold text-accent-text">Freighter Wallet Extension Not Detected</p>
                <p className="text-[11px] text-muted">
                  Install the Freighter browser extension to sign up.{' '}
                  <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer"
                    className="font-bold underline text-accent-text">Get Freighter →</a>
                </p>
              </div>
            )}

            <button id="freighter-signup-btn" onClick={handleFreighterAuth} disabled={busy || available === false}
              className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl disabled:opacity-50">
              <Zap size={18} />
              {busy ? 'Waiting for Freighter…' : (
                <><span>Connect Freighter &amp; Sign Up</span> <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-[11px] text-center leading-relaxed text-muted-2 inline-flex items-start gap-1.5">
              <Wallet size={12} className="mt-0.5 flex-shrink-0" />
              Freighter will ask you to sign a one-time message. This creates your non-custodial account.
            </p>
          </div>

          <p className="text-center text-xs text-muted-2">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline text-accent-text">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
