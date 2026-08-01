'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Vault, VaultStatus } from '@/lib/api';
import { formatMoney, formatDate } from '@/lib/format';
import { BreakVaultModal } from '@/components/plans/BreakVaultModal';
import { ArrowLeft, Pencil, Trash2, Zap } from 'lucide-react';

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
      <div className="card text-center space-y-4">
        <p className="text-danger text-lg">{error}</p>
        <button className="btn-ghost" onClick={() => router.back()}>Go back</button>
      </div>
    </div>
  );

  if (!vault) return <div className="p-8">Loading…</div>;

  const locked = vault.status === VaultStatus.LOCKED;
  const isBill = vault.planType === 'BILL';

  return (
    <>
      <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-foreground mb-6">
          <ArrowLeft size={18} /> Back
        </button>

        <header className="mb-8">
          <div className="text-5xl mb-3">{vault.budgetPlan?.icon ?? '📦'}</div>
          <h1 className="text-4xl">{vault.name}</h1>
          <p className="text-muted text-sm capitalize">{vault.category}</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Amount</p>
            <p className="text-2xl font-semibold" data-balance>{formatMoney(vault.amount)}</p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Status</p>
            <p className="text-2xl font-semibold capitalize">{locked ? 'Protected' : vault.status.toLowerCase()}</p>
          </div>
          {isBill && vault.unlockDate && (
            <div>
              <p className="text-muted text-xs uppercase tracking-wide">Unlock Date</p>
              <p className="text-lg font-medium">{formatDate(vault.unlockDate)}</p>
            </div>
          )}
          {vault.releasedAt && (
            <div>
              <p className="text-muted text-xs uppercase tracking-wide">Released</p>
              <p className="text-lg font-medium">{formatDate(vault.releasedAt)}</p>
            </div>
          )}
          {vault.earlyWithdrawnAt && (
            <div>
              <p className="text-muted text-xs uppercase tracking-wide">Withdrawn early</p>
              <p className="text-lg font-medium text-warning">{formatDate(vault.earlyWithdrawnAt)}</p>
            </div>
          )}
        </div>

        {vault.breakTxHash && (
          <div className="card !bg-clay/30 !py-3 !px-4 mb-6">
            <p className="text-xs text-muted mb-1">Transaction reference</p>
            <p className="mono text-sm break-all">{vault.breakTxHash}</p>
          </div>
        )}

        {locked && (
          <button
            onClick={() => setBreaking(true)}
            className="btn-ghost w-full !border !border-danger/30 !text-danger hover:!bg-danger/10"
          >
            <Zap size={18} /> Withdraw Early
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
