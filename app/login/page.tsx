'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tokens = await api.login(email, password);
      setTokens(tokens);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'rgb(8,11,18)' }}>

      {/* ━━ Left Branding Panel (Desktop) */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative overflow-hidden" style={{ background: 'rgba(14,20,32,0.6)', borderRight: '1px solid rgba(30,45,69,0.7)' }}>
        {/* Aurora */}
        <div className="aurora-orb w-80 h-80 top-[-80px] left-[-60px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-64 h-64 bottom-[-60px] right-[-40px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)' }} />
        <div className="star-field opacity-60" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              <Star size={17} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(228,60%,93%)', letterSpacing: '-0.02em' }}>
              Stellar<span style={{ color: 'hsl(217,91%,60%)' }}>Plan</span>
            </span>
          </Link>
        </div>

        {/* Pitch */}
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: 'hsl(217,91%,60%)' }}>
            <Shield size={13} /> Soroban Smart Vault Platform
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
            Automated Paycheck Protection for Peace of Mind.
          </h2>
          <p style={{ color: 'hsl(222,22%,55%)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Sign in to access your active budget plans, inspect smart vault lock timers, and manage your automated USDC salary allocations.
          </p>

          {/* Testimonial */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(22,30,48,0.8)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-2" style={{ color: 'hsl(228,60%,93%)' }}>
                <Lock size={13} style={{ color: 'hsl(38,92%,50%)' }} /> Active Vault Protection
              </span>
              <span className="font-mono font-bold" style={{ color: 'hsl(189,95%,43%)' }}>100% Secured</span>
            </div>
            <p className="text-xs italic" style={{ color: 'hsl(222,22%,55%)' }}>
              "StellarPlan ensures my rent and electricity are locked the exact minute my salary hits testnet."
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4" style={{ color: 'hsl(222,22%,40%)' }}>
          <span>© 2025 StellarPlan</span>
          <span style={{ color: 'rgba(123,141,176,0.4)' }}>•</span>
          <span>Powered by Soroban</span>
        </div>
      </div>

      {/* ━━ Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
              <Star size={17} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(228,60%,93%)' }}>
              Stellar<span style={{ color: 'hsl(217,91%,60%)' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Welcome Back</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'hsl(222,22%,55%)' }}>Sign in to your StellarPlan dashboard.</p>
          </div>

          <form onSubmit={submit} className="space-y-5 rounded-2xl p-8" style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.9)', boxShadow: '0 32px 80px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05)' }}>
            {error && (
              <div className="rounded-xl px-4 py-3 text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: 'hsl(0,84%,60%)' }}>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(222,22%,55%)' }}>Email Address</label>
              <input
                className="input text-sm"
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(222,22%,55%)' }}>Password</label>
              <input
                className="input text-sm"
                type="password"
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button id="login-submit" className="btn-primary w-full py-3.5 text-sm mt-2" disabled={busy}>
              {busy ? 'Signing in…' : <><span>Sign in to Dashboard</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: 'hsl(222,22%,50%)' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
