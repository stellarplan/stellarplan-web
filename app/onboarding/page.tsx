'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  // If the user already has a wallet linked (returning user), skip onboarding.
  useEffect(() => {
    api.me().then((u) => {
      if (u.walletAddress) router.replace('/dashboard');
    }).catch(() => {});
  }, [router]);

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    setConnecting(true);
    setError('');
    try {
      await api.connectWallet('FREIGHTER', address.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Could not connect wallet.');
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE] shadow-lg text-3xl">
            🔗
          </div>
          <h1 className="text-4xl">Connect your wallet</h1>
          <p className="text-muted">
            StellarPlan will watch this address for salary deposits
            and automatically sort them into your plans.
          </p>
        </header>

        <form onSubmit={connect} className="card space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">
              Stellar public key
            </label>
            <input
              className="input font-mono text-sm"
              placeholder="G…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              pattern="G[A-Z0-9]{55}"
              title="Stellar public keys start with G and are 56 characters."
              required
            />
            <p className="text-xs text-muted mt-2">
              From Freighter, Albedo, xBull, Rabet, Lobstr, or any Stellar wallet.
            </p>
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <button className="btn-primary w-full" disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
          <button
            type="button"
            className="btn-ghost w-full text-sm"
            onClick={() => router.push('/dashboard')}
          >
            I'll do this later
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          <a
            href="https://laboratory.stellar.org/#account-creator?network=test"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Need a testnet wallet?
          </a>
        </p>
      </div>
    </main>
  );
}
