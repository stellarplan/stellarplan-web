'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [freighter, setFreighter] = useState<{ isConnected: boolean; getPublicKey(): Promise<string> } | null>(null);

  useEffect(() => {
    api.me().then((u) => { if (u.walletAddress) router.replace('/dashboard'); }).catch(() => {});
    const w = window as any;
    if (w.freighter?.isConnected) setFreighter(w.freighter);
  }, [router]);

  async function connectWithFreighter() {
    if (!freighter) return;
    setConnecting(true); setError('');
    try {
      const pubkey = await freighter.getPublicKey();
      await api.connectWallet('FREIGHTER', pubkey);
      router.push('/dashboard');
    } catch (err: any) { setError(err.message ?? 'Freighter connection was declined.'); }
    finally { setConnecting(false); }
  }

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    setConnecting(true); setError('');
    try {
      await api.connectWallet('UNKNOWN', address.trim());
      router.push('/dashboard');
    } catch (err: any) { setError(err.message ?? 'Could not connect wallet.'); }
    finally { setConnecting(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: 'rgb(8,11,18)' }}>
      {/* Aurora */}
      <div className="aurora-orb w-96 h-96 top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
      <div className="aurora-orb w-80 h-80 bottom-1/4 right-1/4" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)' }} />
      <div className="star-field opacity-50" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl grid place-items-center mx-auto relative"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', boxShadow: '0 0 40px rgba(59,130,246,0.4), 0 0 80px rgba(124,58,237,0.2)' }}>
            <Star size={36} className="text-white fill-white" />
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(0)' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
            Connect your wallet
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'hsl(222,22%,55%)' }}>
            StellarPlan will watch this address for salary deposits and automatically sort them into your plans.
          </p>
        </div>

        {/* Freighter one-tap */}
        {freighter && (
          <button id="connect-freighter" className="btn-primary w-full py-4 rounded-2xl text-base" onClick={connectWithFreighter} disabled={connecting}>
            {connecting ? 'Connecting…' : <><Zap size={19} /> Connect with Freighter</>}
          </button>
        )}

        {/* Manual form */}
        <form onSubmit={connect} className="rounded-2xl p-6 space-y-5"
          style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(30,45,69,0.9)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'hsl(222,22%,50%)' }}>
              Stellar Public Key
            </label>
            <input
              id="wallet-address-input"
              className="input font-mono text-sm"
              placeholder="G…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              pattern="G[A-Z0-9]{55}"
              title="Stellar public keys start with G and are 56 characters."
              required
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            <p className="text-xs mt-2" style={{ color: 'hsl(222,22%,45%)' }}>
              From Freighter, Albedo, xBull, Rabet, Lobstr, or any Stellar wallet.
            </p>
          </div>

          {error && <p className="text-sm font-medium" style={{ color: 'hsl(0,84%,60%)' }}>{error}</p>}

          <button id="connect-manual-btn" className="btn-primary w-full py-3.5 rounded-xl" disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
          <button type="button" id="skip-wallet-btn"
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors hover:text-foreground"
            style={{ color: 'hsl(222,22%,45%)' }}
            onClick={() => router.push('/dashboard')}>
            I'll do this later
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: 'hsl(222,22%,42%)' }}>
          <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noreferrer"
            className="hover:underline" style={{ color: 'hsl(217,91%,60%)' }}>
            Need a testnet wallet? →
          </a>
        </p>
      </motion.div>
    </main>
  );
}
