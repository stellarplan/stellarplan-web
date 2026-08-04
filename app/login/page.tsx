'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setTokens, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Star, Zap, Wallet } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [freighter, setFreighter] = useState<{ isConnected: boolean; getPublicKey(): Promise<string> } | null>(null);
  const [walletAddr, setWalletAddr] = useState('');
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
      const tokens = await api.login(email, password);
      setTokens(tokens);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'rgb(6,8,16)' }}>

      {/* Left Branding */}
      <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative overflow-hidden"
        style={{ background: 'rgba(13,17,28,0.7)', borderRight: '1px solid rgba(30,38,62,0.8)' }}>
        <div className="aurora-orb w-80 h-80 top-[-80px] left-[-60px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-64 h-64 bottom-[-60px] right-[-40px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
        <div className="star-field opacity-60" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Star size={17} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(225,100%,96%)', letterSpacing: '-0.02em' }}>
              Stellar<span style={{ color: '#818CF8' }}>Plan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8' }}>
            <Zap size={13} /> Non-Custodial Wallet Login
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: 'hsl(225,100%,96%)', fontFamily: 'var(--font-display)' }}>
            Sign In Directly with Your Freighter Wallet.
          </h2>
          <p style={{ color: 'hsl(228,20%,65%)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            No passwords required. Authenticate seamlessly using your Stellar public key to manage smart contract vaults.
          </p>

          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(20,26,42,0.8)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-2" style={{ color: 'hsl(225,100%,96%)' }}>
                <Lock size={13} style={{ color: '#F43F5E' }} /> Soroban Vault Protocol
              </span>
              <span className="font-mono font-bold" style={{ color: '#06B6D4' }}>100% Non-Custodial</span>
            </div>
            <p className="text-xs italic" style={{ color: 'hsl(228,20%,65%)' }}>
              "Sign in with Freighter in 1-click. Your private keys never leave your browser extension."
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs flex items-center gap-4" style={{ color: 'hsl(228,20%,45%)' }}>
          <span>© 2025 StellarPlan</span>
          <span>•</span>
          <span>Stellar Testnet Integration</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <Star size={17} className="text-white fill-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'hsl(225,100%,96%)' }}>
              Stellar<span style={{ color: '#818CF8' }}>Plan</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(225,100%,96%)', fontFamily: 'var(--font-display)' }}>Sign In to StellarPlan</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'hsl(228,20%,65%)' }}>Authenticate with your Freighter wallet or credentials.</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-xl p-1" style={{ background: 'rgba(20,26,42,0.9)', border: '1px solid rgba(30,38,62,0.8)' }}>
            <button
              type="button"
              onClick={() => setTab('wallet')}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              style={tab === 'wallet' ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#818CF8' } : { color: 'hsl(228,20%,65%)' }}
            >
              <Wallet size={14} /> Freighter Wallet
            </button>
            <button
              type="button"
              onClick={() => setTab('email')}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
              style={tab === 'email' ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#818CF8' } : { color: 'hsl(228,20%,65%)' }}
            >
              Email &amp; Password
            </button>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-xs font-semibold" style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E' }}>
              {error}
            </div>
          )}

          {tab === 'wallet' ? (
            <div className="space-y-5 rounded-2xl p-8" style={{ background: 'rgba(13,17,28,0.9)', border: '1px solid rgba(30,38,62,0.9)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
              {/* One-tap Freighter */}
              {freighter ? (
                <button
                  id="freighter-login-btn"
                  onClick={handleFreighterAuth}
                  disabled={busy}
                  className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                >
                  <Zap size={18} /> {busy ? 'Connecting to Freighter…' : 'Sign In with Freighter Wallet'}
                </button>
              ) : (
                <div className="rounded-xl p-4 text-center space-y-2" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-xs font-semibold" style={{ color: '#818CF8' }}>Freighter Wallet Extension Not Detected</p>
                  <p className="text-[11px]" style={{ color: 'hsl(228,20%,65%)' }}>
                    Install Freighter extension or enter your public key below to sign in instantly.
                  </p>
                </div>
              )}

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(30,38,62,0.8)' }} />
                <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'hsl(228,20%,50%)' }}>or paste public key</span>
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(30,38,62,0.8)' }} />
              </div>

              {/* Public key form */}
              <form onSubmit={handleKeyAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(228,20%,65%)' }}>Stellar Public Key</label>
                  <input
                    id="wallet-key-input"
                    className="input text-xs font-mono"
                    placeholder="G..."
                    value={walletAddr}
                    onChange={(e) => setWalletAddr(e.target.value)}
                    pattern="G[A-Z0-9]{55}"
                    required
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <button id="key-login-submit" className="btn-primary w-full py-3.5 text-sm" disabled={busy}>
                  {busy ? 'Authenticating…' : <><span>Sign In with Public Key</span> <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-5 rounded-2xl p-8" style={{ background: 'rgba(13,17,28,0.9)', border: '1px solid rgba(30,38,62,0.9)' }}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(228,20%,65%)' }}>Email Address</label>
                <input className="input text-sm" type="email" id="login-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'hsl(228,20%,65%)' }}>Password</label>
                <input className="input text-sm" type="password" id="login-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button id="login-submit" className="btn-primary w-full py-3.5 text-sm" disabled={busy}>
                {busy ? 'Signing in…' : <><span>Sign in to Dashboard</span> <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          <p className="text-center text-xs" style={{ color: 'hsl(228,20%,50%)' }}>
            New to StellarPlan?{' '}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: '#818CF8' }}>
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
