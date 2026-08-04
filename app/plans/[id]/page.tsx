'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatDate, iconFor } from '@/lib/format';
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
      <div className="rounded-2xl text-center space-y-4 p-10" style={{ background: 'rgba(14,20,32,0.9)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <p style={{ color: 'hsl(0,84%,60%)' }}>{error}</p>
        <button className="btn-ghost" onClick={() => router.back()}>Go back</button>
      </div>
    </div>
  );

  if (!vault) return (
    <div className="p-8 text-center py-20" style={{ color: 'hsl(222,22%,55%)' }}>
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: 'hsl(217,91%,60%)' }} />
        Loading vault…
      </div>
    </div>
  );

  const locked = vault.status === VaultStatus.LOCKED;
  const isBill = vault.planType === 'BILL';
  const icon = iconFor(vault.category, vault.budgetPlan?.icon);

  return (
    <>
      <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-foreground" style={{ color: 'hsl(222,22%,50%)' }}>
          <ArrowLeft size={16} /> Back to Plans
        </button>

        {/* Header */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{ background: locked
            ? 'linear-gradient(135deg, rgba(30,58,96,0.8) 0%, rgba(20,37,64,0.95) 100%)'
            : 'rgba(14,20,32,0.9)',
            border: locked ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(30,45,69,0.8)',
            boxShadow: locked ? '0 0 40px rgba(59,130,246,0.08)' : 'none',
          }}>
          {locked && <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />}

          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl grid place-items-center text-3xl flex-shrink-0"
              style={{ background: locked ? 'rgba(59,130,246,0.15)' : 'rgba(30,45,69,0.8)', border: locked ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(30,45,69,0.8)' }}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>{vault.name}</h1>
              <p className="text-sm capitalize mt-0.5" style={{ color: 'hsl(222,22%,55%)' }}>{vault.category}</p>
              <div className="flex items-center gap-2 mt-3">
                {locked
                  ? <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: 'hsl(217,91%,60%)' }}><ShieldCheck size={12} /> Protected</span>
                  : <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: 'hsl(189,95%,43%)' }}><Unlock size={12} /> {vault.status.toLowerCase()}</span>
                }
              </div>
            </div>
            <div className="flex-shrink-0" style={{ color: locked ? 'hsl(217,91%,60%)' : 'hsl(189,95%,43%)' }}>
              {locked ? <Lock size={24} /> : <Unlock size={24} />}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}>
            <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'hsl(222,22%,45%)' }}>Amount</p>
            <p className="text-2xl font-bold" style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }} data-balance>{formatMoney(vault.amount)}</p>
            <p className="text-xs mt-1" style={{ color: 'hsl(222,22%,45%)' }}>USDC</p>
          </div>

          {isBill && vault.unlockDate && (
            <div className="rounded-2xl p-5" style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'hsl(222,22%,45%)' }}>Unlock Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'hsl(217,91%,60%)' }} />
                <p className="font-semibold text-base" style={{ color: 'hsl(228,60%,93%)' }}>{formatDate(vault.unlockDate)}</p>
              </div>
            </div>
          )}

          {vault.releasedAt && (
            <div className="rounded-2xl p-5" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'hsl(222,22%,45%)' }}>Released</p>
              <p className="font-semibold" style={{ color: 'hsl(189,95%,43%)' }}>{formatDate(vault.releasedAt)}</p>
            </div>
          )}

          {vault.earlyWithdrawnAt && (
            <div className="rounded-2xl p-5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'hsl(222,22%,45%)' }}>Withdrawn Early</p>
              <p className="font-semibold" style={{ color: 'hsl(38,92%,50%)' }}>{formatDate(vault.earlyWithdrawnAt)}</p>
            </div>
          )}
        </div>

        {/* Tx hash */}
        {vault.breakTxHash && (
          <div className="rounded-2xl px-5 py-4 mb-6" style={{ background: 'rgba(22,30,48,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}>
            <p className="text-xs mb-1" style={{ color: 'hsl(222,22%,45%)' }}>Transaction reference</p>
            <p className="text-sm font-mono break-all" style={{ color: 'hsl(217,91%,60%)', fontFamily: 'var(--font-mono)' }}>{vault.breakTxHash}</p>
          </div>
        )}

        {/* Early withdrawal */}
        {locked && (
          <button id="withdraw-early-btn"
            onClick={() => setBreaking(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'hsl(0,84%,60%)' }}
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
        onConfirm={(password) => api.breakVault(vault.id, password).then(() => {})}
      />
    </>
  );
}
