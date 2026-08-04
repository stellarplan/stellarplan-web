'use client';

import { useEffect, useState } from 'react';
import { api, Transaction } from '@/lib/api';
import { formatRelative, formatMoney } from '@/lib/format';
import { FadeIn } from '@/components/common/FadeIn';

const TYPE_META: Record<Transaction['type'], { icon: string; label: string; sign: '+' | '-' | ''; color: string }> = {
  SALARY_DEPOSIT:   { icon: '💵', label: 'Salary received',      sign: '+', color: 'hsl(189,95%,43%)' },
  ALLOCATION:       { icon: '🔀', label: 'Allocated to plan',    sign: '-', color: 'hsl(228,60%,93%)' },
  RELEASE:          { icon: '🔓', label: 'Funds unlocked',       sign: '+', color: 'hsl(189,95%,43%)' },
  EARLY_WITHDRAWAL: { icon: '⚡', label: 'Early withdrawal',     sign: '-', color: 'hsl(38,92%,50%)' },
  DEPOSIT:          { icon: '📥', label: 'Deposit',              sign: '+', color: 'hsl(189,95%,43%)' },
};

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.transactions(50).then(setTransactions).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      {/* Header */}
      <h1 className="mb-1" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>Activity</h1>
      <p className="mb-8 text-sm" style={{ color: 'hsl(222,22%,50%)' }}>Everything that's happened with your money.</p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8" style={{ color: 'hsl(222,22%,50%)' }}>
          <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: 'hsl(217,91%,60%)' }} />
          <span className="text-sm">Loading activity…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && transactions.length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-4"
          style={{ background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(30,45,69,0.7)' }}>
          <div className="text-4xl">📝</div>
          <p className="text-sm" style={{ color: 'hsl(222,22%,55%)' }}>No activity yet. Once you receive a salary, history will appear here.</p>
        </div>
      )}

      <FadeIn>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}>
          {transactions.map((t, i) => {
            const meta = TYPE_META[t.type] ?? { icon: '📥', label: t.type, sign: '', color: 'hsl(228,60%,93%)' };
            return (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4"
                style={{ borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,45,69,0.5)' : 'none' }}>
                <div className="w-11 h-11 rounded-xl grid place-items-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(22,30,48,0.9)', border: '1px solid rgba(30,45,69,0.7)' }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'hsl(228,60%,93%)' }}>{t.description ?? meta.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(222,22%,50%)' }}>{formatRelative(t.createdAt)}</p>
                  {t.txHash && !t.txHash.startsWith('sim_') && (
                    <p className="text-xs mt-1 font-mono truncate max-w-[200px]" style={{ color: 'hsl(217,91%,50%)', fontFamily: 'var(--font-mono)' }}>{t.txHash}</p>
                  )}
                </div>
                <span className="font-mono font-bold text-sm" data-balance style={{ color: meta.color, fontFamily: 'var(--font-mono)' }}>
                  {meta.sign}{formatMoney(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </main>
  );
}
