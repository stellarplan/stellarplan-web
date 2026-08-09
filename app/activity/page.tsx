'use client';

import { useEffect, useState } from 'react';
import { api, Transaction } from '@/lib/api';
import { formatDate, formatMoney } from '@/lib/format';
import { FadeIn } from '@/components/common/FadeIn';

const TYPE_ICONS: Record<Transaction['type'], { icon: string; color: string }> = {
  SALARY_DEPOSIT:    { icon: '💵', color: 'rgb(var(--accent-rgb))' },
  ALLOCATION:        { icon: '🔀', color: 'rgb(var(--nova-rgb))' },
  RELEASE:           { icon: '🔓', color: 'rgb(var(--accent-rgb))' },
  EARLY_WITHDRAWAL:  { icon: '⚡', color: 'rgb(var(--danger-rgb))' },
  DEPOSIT:           { icon: '📥', color: 'rgb(var(--accent-rgb))' },
};

export default function ActivityPage() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.transactions(50).then(setTxs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = txs.filter((t) => filter === 'ALL' || t.type === filter);

  return (
    <main className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="text-3xl font-bold mb-1 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Activity</h1>
      <p className="mb-8 text-sm text-muted">Audit trail of salary deposits, allocations, and releases.</p>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['ALL', 'SALARY_DEPOSIT', 'ALLOCATION', 'RELEASE', 'EARLY_WITHDRAWAL'].map((t) => (
          <button key={t} id={`tx-filter-${t.toLowerCase()}`} onClick={() => setFilter(t)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200"
            style={filter === t ? {
              background: 'rgb(var(--accent-rgb) / 0.15)',
              border: '1px solid rgb(var(--accent-rgb))',
              color: 'rgb(var(--accent-rgb))',
            } : {
              background: 'rgb(var(--surface-rgb))',
              border: '1px solid rgb(var(--border-rgb))',
              color: 'hsl(var(--muted))',
            }}>
            {t === 'ALL' ? 'All Activity' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-8 text-muted">
          <div className="w-4 h-4 rounded-full border-2 animate-spin border-accent-line border-t-emerald-500" />
          <span className="text-sm">Loading activity log…</span>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-2 bg-surface border border-border">
          <img src="/icons/scroll.png" alt="" width={36} height={36} draggable={false}
            className="category-icon mx-auto mb-2" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <p className="text-sm text-muted">No activity recorded yet.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <FadeIn>
          <div className="rounded-2xl overflow-hidden bg-surface border border-border">
            {filtered.map((tx, i) => {
              const meta = TYPE_ICONS[tx.type] ?? { icon: '📄', color: 'hsl(var(--muted))' };
              const positive = tx.type === 'SALARY_DEPOSIT' || tx.type === 'RELEASE' || tx.type === 'DEPOSIT';
              return (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgb(var(--border-rgb))' : 'none' }}>
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-lg flex-shrink-0 bg-surface-2">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">{tx.description ?? tx.type}</p>
                    <p className="text-xs text-muted-2">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm" data-balance
                      style={{ color: positive ? 'rgb(var(--accent-rgb))' : 'hsl(var(--foreground))', fontFamily: 'var(--font-mono)' }}>
                      {positive ? '+' : '−'}{formatMoney(tx.amount)}
                    </p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-2">USDC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      )}
    </main>
  );
}
