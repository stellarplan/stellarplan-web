'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, Star, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tokens = await api.register(email, password, name);
      setTokens(tokens);
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'rgb(8,11,18)' }}>

      {/* ━━ Left Branding Panel */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative overflow-hidden" style={{ background: 'rgba(14,20,32,0.6)', borderRight: '1px solid rgba(30,45,69,0.7)' }}>
        <div className="aurora-orb w-80 h-80 top-[-80px] right-[-60px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-64 h-64 bottom-[-60px] left-[-40px]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />
        <div className="star-field opacity-60" />

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

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: 'hsl(263,70%,68%)' }}>
            <Shield size={13} /> Join StellarPlan
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
            Create Your Protected Financial Future in Seconds.
          </h2>
          <p style={{ color: 'hsl(222,22%,55%)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Configure salary rules once. StellarPlan will interface with your Stellar wallet to automatically secure monthly bill targets.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Instant Soroban smart contract vault generation',
              'No custodial risk — you retain full wallet ownership',
              'Real-time Horizon balance and deposit monitoring',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-xs font-semibold" style={{ color: 'hsl(228,60%,80%)' }}>
                <CheckCircle2 size={15} style={{ color: 'hsl(189,95%,43%)', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4" style={{ color: 'hsl(222,22%,40%)' }}>
          <span>© 2025 StellarPlan</span>
          <span style={{ color: 'rgba(123,141,176,0.4)' }}>•</span>
          <span>Stellar &amp; Soroban Protocol</span>
        </div>
      </div>

      {/* ━━ Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="md:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
              <Star size={17} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(228,60%,93%)' }}>
              Stellar<span style={{ color: 'hsl(217,91%,60%)' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Create Your Account</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'hsl(222,22%,55%)' }}>Start protecting your paycheck automatically.</p>
          </div>

          <form onSubmit={submit} className="space-y-5 rounded-2xl p-8" style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.9)', boxShadow: '0 32px 80px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.05)' }}>
            {error && (
              <div className="rounded-xl px-4 py-3 text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: 'hsl(0,84%,60%)' }}>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(222,22%,55%)' }}>Full Name</label>
              <input id="signup-name" className="input text-sm" placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(222,22%,55%)' }}>Email Address</label>
              <input id="signup-email" className="input text-sm" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(222,22%,55%)' }}>Password</label>
              <input id="signup-password" className="input text-sm" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              <p className="text-xs" style={{ color: 'hsl(222,22%,45%)' }}>Minimum 8 characters.</p>
            </div>

            <button id="signup-submit" className="btn-primary w-full py-3.5 text-sm mt-2" disabled={busy}>
              {busy ? 'Creating Account…' : <><span>Create Account &amp; Continue</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: 'hsl(222,22%,50%)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
