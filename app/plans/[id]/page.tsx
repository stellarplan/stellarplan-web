'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Vault, VaultStatus } from '@/lib/api';
import { signAndBreakVault } from '@/lib/freighter';
import { formatMoney, formatDate } from '@/lib/format';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { BreakVaultModal } from '@/components/plans/BreakVaultModal';
import { ArrowLeft, Lock, Unlock, Zap, Calendar, ShieldCheck } from 'lucide-react';

export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [vault, setVault] = useState<Vault | null>(null);
  const [breaking, setBreaking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.vault(id as string).then(setVault).catch((e) => setError(e.message));
  }, [id]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-2xl text-center space-y-4 p-10 bg-surface border border-danger-line">
        <p className="text-danger-text">{error}</p>
        <button className="btn-ghost" onClick={() => router.back()}>Go back</button>
      </div>
    </div>
  );

  if (!vault) return (
    <div className="p-8 text-center py-20 text-muted">
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 animate-spin border-accent-line border-t-emerald-500" />
        Loading vault…
      </div>
    </div>
  );

  const locked = vault.status === VaultStatus.LOCKED;
  const isBill = vault.planType === 'BILL';

  return (
    <>
      <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors text-muted-2 hover:text-foreground">
          <ArrowLeft size={16} /> Back to Plans
        </button>

        {/* Header */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={locked ? { background: 'rgb(var(--accent-rgb) / 0.1)', border: '1px solid rgb(var(--accent-rgb))' } : { background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--border-rgb))' }}>
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl grid place-items-center flex-shrink-0"
              style={locked ? { background: 'rgb(var(--accent-rgb) / 0.15)', border: '1px solid rgb(var(--accent-rgb) / 0.3)' } : { background: 'rgb(var(--surface-2-rgb))', border: '1px solid rgb(var(--border-rgb))' }}>
              <CategoryIcon category={vault.category} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{vault.name}</h1>
              <p className="text-sm capitalize mt-0.5 text-muted">{vault.category}</p>
              <div className="flex items-center gap-2 mt-3">
                {locked
                  ? <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-accent-soft border border-accent-line text-accent-text"><ShieldCheck size={12} /> Protected</span>
                  : <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-nova-soft border border-nova-line text-nova-text"><Unlock size={12} /> {vault.status.toLowerCase()}</span>
                }
              </div>
            </div>
            <div className="flex-shrink-0" style={{ color: locked ? 'rgb(var(--accent-rgb))' : 'hsl(var(--muted))' }}>
              {locked ? <Lock size={24} /> : <Unlock size={24} />}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-5 bg-surface border border-border">
            <p className="text-xs uppercase tracking-wider font-bold mb-2 text-muted-2">Amount</p>
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-mono)' }} data-balance>{formatMoney(vault.amount)}</p>
            <p className="text-xs mt-1 text-muted-2">USDC</p>
          </div>

          {isBill && vault.unlockDate && (
            <div className="rounded-2xl p-5 bg-surface border border-border">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-muted-2">Unlock Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-accent-text" />
                <p className="font-semibold text-base text-foreground">{formatDate(vault.unlockDate)}</p>
              </div>
            </div>
          )}

          {vault.releasedAt && (
            <div className="rounded-2xl p-5 bg-accent-soft border border-accent-line">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-muted-2">Released</p>
              <p className="font-semibold text-accent-text">{formatDate(vault.releasedAt)}</p>
            </div>
          )}

          {vault.earlyWithdrawnAt && (
            <div className="rounded-2xl p-5 bg-danger-soft border border-danger-line">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-muted-2">Withdrawn Early</p>
              <p className="font-semibold text-danger-text">{formatDate(vault.earlyWithdrawnAt)}</p>
            </div>
          )}
        </div>

        {/* Tx hash */}
        {vault.breakTxHash && (
          <div className="rounded-2xl px-5 py-4 mb-6 bg-surface border border-border">
            <p className="text-xs mb-1 text-muted-2">Transaction reference</p>
            <p className="text-sm font-mono break-all text-accent-text" style={{ fontFamily: 'var(--font-mono)' }}>{vault.breakTxHash}</p>
          </div>
        )}

        {/* Early withdrawal */}
        {locked && (
          <button id="withdraw-early-btn"
            onClick={() => setBreaking(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-danger-soft border border-danger-line text-danger-text hover:bg-danger-soft"
          >
            <Zap size={17} /> Withdraw Early
          </button>
        )}
      </main>

      <BreakVaultModal
        open={breaking}
        purpose={vault.name}
        onClose={async (success) => {
          setBreaking(false);
          if (success) setVault(await api.vault(vault.id));
        }}
        onConfirm={() => signAndBreakVault(vault.id).then(() => {})}
      />
    </>
  );
}
