'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, Star, Wallet, Zap } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [freighter, setFreighter] = useState<{ isConnected: boolean; getPublicKey(): Promise<string> } | null>(null);
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const w = window as any;
    if (w.freighter?.isConnected) setFreighter(w.freighter);
  }, []);

  async function connectFreighter() {
    if (!freighter) return;
    setError(''); setBusy(true);
    try {
      const pubkey = await freighter.getPublicKey();
      await api.connectWallet('FREIGHTER', pubkey);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Failed to connect Freighter wallet');
    } finally { setBusy(false); }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setError(''); setBusy(true);
    try {
      await api.connectWallet('FREIGHTER', address.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Wallet connection failed');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full space-y-7 rounded-3xl p-8 bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-indigo-600">
            <Star size={19} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Connect Freighter Wallet</h1>
            <p className="text-xs text-slate-400">Step 1 of 1: Connect your Stellar wallet</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 space-y-2 bg-indigo-950/40 border border-indigo-800 text-slate-300">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <Shield size={14} /> Non-Custodial Security
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            StellarPlan uses Soroban smart contracts on Stellar. Connecting your wallet allows smart vaults to detect salary deposits automatically.
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-xs font-semibold bg-rose-950 border border-rose-800 text-rose-400">
            {error}
          </div>
        )}

        {freighter ? (
          <button id="onboarding-freighter-btn" onClick={connectFreighter} disabled={busy} className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl">
            <Zap size={18} /> {busy ? 'Connecting…' : 'Connect Freighter Wallet'}
          </button>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block text-slate-400">Stellar Public Key</label>
              <input id="onboarding-pubkey-input" className="input text-xs font-mono" placeholder="G..." value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <button id="onboarding-submit-btn" className="btn-primary w-full py-3.5 text-sm" disabled={busy}>
              {busy ? 'Connecting…' : <><span>Connect Public Key</span> <ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <button type="button" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" onClick={() => router.push('/dashboard')}>
            Skip for now (Demo mode)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
