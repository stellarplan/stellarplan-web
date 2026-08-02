'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Branding Showcase Panel (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-surface/90 border-r border-clay/60 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-jade/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-copper/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE] grid place-items-center text-xl shadow-inner border border-clay/60">
              🌠
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Stellar<span className="text-jade">Plan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jade/10 border border-jade/30 text-jade text-xs font-bold uppercase tracking-wider">
            <Shield size={14} /> Soroban Smart Vault Web Application
          </div>
          <h2 className="text-4xl font-serif font-bold text-foreground leading-tight">
            Automated Paycheck Protection for Peace of Mind.
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Sign in to access your active budget plans, inspect smart vault lock timers, and manage your USDC automated salary allocations.
          </p>

          <div className="card !p-5 border-jade/30 bg-surface/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Lock size={14} className="text-copper-dark" /> Active Vault Protection
              </span>
              <span className="text-jade font-mono font-bold">100% Secured</span>
            </div>
            <p className="text-xs text-muted">
              "StellarPlan ensures my rent and electricity are locked the exact minute my salary hits testnet."
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted flex items-center gap-4">
          <span>© StellarPlan</span>
          <span>•</span>
          <span>Soroban Smart Contracts</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="md:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE] grid place-items-center text-xl shadow-inner border border-clay/60">
              🌠
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Stellar<span className="text-jade">Plan</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted text-sm mt-1">Sign in to your StellarPlan Web Dashboard.</p>
          </div>

          <form onSubmit={submit} className="card p-8 space-y-5 border-clay/60 shadow-xl glow-jade">
            {error && (
              <div className="chip-danger w-full py-3 px-4 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider block">Email Address</label>
              <input
                className="input text-sm font-medium"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider block">Password</label>
              <input
                className="input text-sm font-medium"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary w-full py-3.5 text-sm shadow-md" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in to Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs text-muted font-medium">
            Don't have an account?{' '}
            <Link href="/signup" className="text-jade font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
