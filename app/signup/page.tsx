'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Star, Zap, Wallet } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [freighter, setFreighter] = useState<{ isConnected: boolean; getPublicKey(): Promise<string> } | null>(null);
  const [walletAddr, setWalletAddr] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'wallet' | 'email'>('wallet');

  useEffect(() => {
    const w = window as any;
    if (w.freighter?.isConnected) setFreighter(w.freighter);
  }, []);

  async function handleFreighterAuth() {
    if (!freighter) return;
    setError(''); setBusy(true);
    try {
      const pubkey = await freighter.getPublicKey();
      const tokens = await api.loginWithWallet(pubkey, 'FREIGHTER');
      setTokens(tokens);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Freighter connection failed or was rejected');
    } finally { setBusy(false); }
  }

  async function handleKeyAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddr.trim()) return;
    setError(''); setBusy(true);
    try {
      const tokens = await api.loginWithWallet(walletAddr.trim(), 'FREIGHTER');
      setTokens(tokens);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Wallet authentication failed');
    } finally { setBusy(false); }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const tokens = await api.register(email, password, name);
      setTokens(tokens);
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#0C0D10' }}>

      {/* Left Branding */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative bg-zinc-900 border-r border-zinc-800">
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
            Connect your Freighter wallet to start automatically splitting salary into protected non-custodial vaults.
          </p>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4 text-zinc-500">
          <span>© 2025 StellarPlan</span>
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
            <p className="mt-1.5 text-sm text-zinc-400">Connect Freighter wallet or register credentials.</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-xl p-1 bg-zinc-900 border border-zinc-800">
            <button type="button" onClick={() => setTab('wallet')}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              style={tab === 'wallet' ? { background: '#10B981', color: '#000' } : { color: '#A1A1AA' }}>
              <Wallet size={14} /> Freighter Wallet
            </button>
            <button type="button" onClick={() => setTab('email')}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
              style={tab === 'email' ? { background: '#10B981', color: '#000' } : { color: '#A1A1AA' }}>
              Email &amp; Password
            </button>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-rose-950 border border-rose-800 text-rose-400">
              {error}
            </div>
          )}

          {tab === 'wallet' ? (
            <div className="space-y-5 rounded-2xl p-8 bg-zinc-900 border border-zinc-800">
              {freighter ? (
                <button id="freighter-signup-btn" onClick={handleFreighterAuth} disabled={busy}
                  className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl">
                  <Zap size={18} /> {busy ? 'Connecting to Freighter…' : 'Connect Freighter Wallet & Sign Up'}
                </button>
              ) : (
                <div className="rounded-xl p-4 text-center space-y-2 bg-emerald-950/60 border border-emerald-800">
                  <p className="text-xs font-semibold text-emerald-400">Freighter Wallet Extension Not Detected</p>
                  <p className="text-[11px] text-zinc-400">
                    Install Freighter extension or enter your public key below to sign up.
                  </p>
                </div>
              )}

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-800" />
                <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">or paste public key</span>
                <div className="flex-grow border-t border-zinc-800" />
              </div>

              <form onSubmit={handleKeyAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Stellar Public Key</label>
                  <input id="wallet-key-signup-input" className="input text-xs font-mono" placeholder="G..." value={walletAddr}
                    onChange={(e) => setWalletAddr(e.target.value)} pattern="G[A-Z0-9]{55}" required />
                </div>
                <button id="key-signup-submit" className="btn-primary w-full py-3.5 text-sm" disabled={busy}>
                  {busy ? 'Creating account…' : <><span>Sign Up with Public Key</span> <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-5 rounded-2xl p-8 bg-zinc-900 border border-zinc-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Your Name</label>
                <input className="input text-sm" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Email Address</label>
                <input className="input text-sm" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Password</label>
                <input className="input text-sm" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button id="signup-submit" className="btn-primary w-full py-3.5 text-sm" disabled={busy}>
                {busy ? 'Creating Account…' : <><span>Create Account</span> <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline text-emerald-400">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
