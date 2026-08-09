'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isFreighterAvailable, loginWithFreighter } from '@/lib/freighter';
import { ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Lock, Zap, Wallet, ArrowRight } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function LoginPage() {
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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : err?.message ?? 'Freighter connection failed or was rejected');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'rgb(var(--background-rgb))' }}>

      {/* Left Branding */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative overflow-hidden bg-surface border-r border-border">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-accent/10 border border-accent/30">
              <Logo size={24} className="text-accent" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--foreground))' }}>
              Stellar<span style={{ color: 'rgb(var(--accent-rgb))' }}>Plan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-soft border border-accent-line text-accent-text">
            <Zap size={13} /> Non-Custodial Wallet Login
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>
            Sign In by Signing a Message with Freighter.
          </h2>
          <p style={{ color: 'hsl(var(--muted))', fontSize: '0.875rem', lineHeight: 1.7 }}>
            No passwords. You prove ownership of your Stellar account by signing a one-time challenge — your private key never leaves your wallet.
          </p>

          <div className="rounded-2xl p-5 space-y-3 bg-surface-2 border border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-2 text-foreground">
                <Lock size={13} className="text-danger-text" /> Soroban Vault Protocol
              </span>
              <span className="font-mono font-bold text-accent-text">100% Non-Custodial</span>
            </div>
            <p className="text-xs italic text-muted">
              &quot;Connect, sign the challenge, and you&apos;re in. Nothing to remember, nothing to leak.&quot;
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4 text-muted-2">
          <span>© 2026 StellarPlan</span>
          <span>•</span>
          <span>Stellar Testnet Integration</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-accent/10 border border-accent/30">
              <Logo size={24} className="text-accent" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--foreground))' }}>
              Stellar<span style={{ color: 'rgb(var(--accent-rgb))' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>Sign In to StellarPlan</h1>
            <p className="mt-1.5 text-sm text-muted">Authenticate with your Freighter wallet.</p>
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
                  Install the Freighter browser extension to sign in.{' '}
                  <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer"
                    className="font-bold underline text-accent-text">Get Freighter →</a>
                </p>
              </div>
            )}

            <button id="freighter-login-btn" onClick={handleFreighterAuth} disabled={busy || available === false}
              className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl disabled:opacity-50">
              <Zap size={18} />
              {busy ? 'Waiting for Freighter…' : (
                <><span>Sign In with Freighter</span> <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-[11px] text-center leading-relaxed text-muted-2 inline-flex items-start gap-1.5">
              <Wallet size={12} className="mt-0.5 flex-shrink-0" />
              Freighter will open and ask you to sign a one-time message. This proves ownership and authorizes no transfer.
            </p>
          </div>

          <p className="text-center text-xs text-muted-2">
            New to StellarPlan?{' '}
            <Link href="/signup" className="font-bold hover:underline text-accent-text">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
