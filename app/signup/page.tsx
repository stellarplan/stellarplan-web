'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isFreighterAvailable, loginWithFreighter } from '@/lib/freighter';
import { ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Star, Zap, Wallet } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#0C0D10' }}>

      {/* Left Branding */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative bg-[#141519] border-r border-[#2B2C33]">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-emerald-500">
              <Star size={17} className="text-black fill-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#FAFAFA' }}>
              Stellar<span style={{ color: '#10B981' }}>Plan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Shield size={13} /> Non-Custodial Salary Vaults
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>
            Protect Your Paycheck with Soroban Smart Contracts.
          </h2>
          <p style={{ color: '#A1A1AA', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Connect your Freighter wallet and sign in — your account is created the first time you sign. No email, no password.
          </p>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4 text-[#71717A]">
          <span>© 2026 StellarPlan</span>
          <span>•</span>
          <span>Stellar Testnet</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-emerald-500">
              <Star size={17} className="text-black fill-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#FAFAFA' }}>
              Stellar<span style={{ color: '#10B981' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>Create Your Account</h1>
            <p className="mt-1.5 text-sm text-[#A1A1AA]">Connect Freighter and sign to get started.</p>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-rose-950 border border-rose-800 text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-5 rounded-2xl p-8 bg-[#141519] border border-[#2B2C33]">
            {available === false && (
              <div className="rounded-xl p-4 text-center space-y-2 bg-emerald-950/60 border border-emerald-800">
                <p className="text-xs font-semibold text-emerald-400">Freighter Wallet Extension Not Detected</p>
                <p className="text-[11px] text-[#A1A1AA]">
                  Install the Freighter browser extension to sign up.{' '}
                  <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer"
                    className="font-bold underline text-emerald-400">Get Freighter →</a>
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

            <p className="text-[11px] text-center leading-relaxed text-[#71717A] inline-flex items-start gap-1.5">
              <Wallet size={12} className="mt-0.5 flex-shrink-0" />
              Freighter will ask you to sign a one-time message. This creates your non-custodial account.
            </p>
          </div>

          <p className="text-center text-xs text-[#71717A]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline text-emerald-400">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
