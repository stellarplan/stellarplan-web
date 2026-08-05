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
      <div className="rounded-2xl text-center space-y-4 p-10 bg-[#141519] border border-rose-800">
        <p className="text-rose-400">{error}</p>
        <button className="btn-ghost" onClick={() => router.back()}>Go back</button>
      </div>
    </div>
  );

  if (!vault) return (
    <div className="p-8 text-center py-20 text-[#A1A1AA]">
      <div className="inline-flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 animate-spin border-emerald-500/30 border-t-emerald-500" />
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
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors text-[#71717A] hover:text-[#FAFAFA]">
          <ArrowLeft size={16} /> Back to Plans
        </button>

        {/* Header */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={locked ? { background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981' } : { background: '#141519', border: '1px solid #2B2C33' }}>
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl grid place-items-center text-3xl flex-shrink-0"
              style={locked ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' } : { background: '#1C1D22', border: '1px solid #2B2C33' }}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'var(--font-display)' }}>{vault.name}</h1>
              <p className="text-sm capitalize mt-0.5 text-[#A1A1AA]">{vault.category}</p>
              <div className="flex items-center gap-2 mt-3">
                {locked
                  ? <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400"><ShieldCheck size={12} /> Protected</span>
                  : <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400"><Unlock size={12} /> {vault.status.toLowerCase()}</span>
                }
              </div>
            </div>
            <div className="flex-shrink-0" style={{ color: locked ? '#10B981' : '#A1A1AA' }}>
              {locked ? <Lock size={24} /> : <Unlock size={24} />}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-5 bg-[#141519] border border-[#2B2C33]">
            <p className="text-xs uppercase tracking-wider font-bold mb-2 text-[#71717A]">Amount</p>
            <p className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'var(--font-mono)' }} data-balance>{formatMoney(vault.amount)}</p>
            <p className="text-xs mt-1 text-[#71717A]">USDC</p>
          </div>

          {isBill && vault.unlockDate && (
            <div className="rounded-2xl p-5 bg-[#141519] border border-[#2B2C33]">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-[#71717A]">Unlock Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-emerald-400" />
                <p className="font-semibold text-base text-[#FAFAFA]">{formatDate(vault.unlockDate)}</p>
              </div>
            </div>
          )}

          {vault.releasedAt && (
            <div className="rounded-2xl p-5 bg-emerald-950/40 border border-emerald-800">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-[#71717A]">Released</p>
              <p className="font-semibold text-emerald-400">{formatDate(vault.releasedAt)}</p>
            </div>
          )}

          {vault.earlyWithdrawnAt && (
            <div className="rounded-2xl p-5 bg-rose-950/40 border border-rose-800/60">
              <p className="text-xs uppercase tracking-wider font-bold mb-2 text-[#71717A]">Withdrawn Early</p>
              <p className="font-semibold text-rose-400">{formatDate(vault.earlyWithdrawnAt)}</p>
            </div>
          )}
        </div>

        {/* Tx hash */}
        {vault.breakTxHash && (
          <div className="rounded-2xl px-5 py-4 mb-6 bg-[#141519] border border-[#2B2C33]">
            <p className="text-xs mb-1 text-[#71717A]">Transaction reference</p>
            <p className="text-sm font-mono break-all text-emerald-400" style={{ fontFamily: 'var(--font-mono)' }}>{vault.breakTxHash}</p>
          </div>
        )}

        {/* Early withdrawal */}
        {locked && (
          <button id="withdraw-early-btn"
            onClick={() => setBreaking(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-950/60"
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
