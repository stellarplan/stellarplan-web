'use client';

import { useEffect, useState } from 'react';
import { api, Transaction } from '@/lib/api';
import { formatRelative, formatMoney } from '@/lib/format';
import { FadeIn } from '@/components/common/FadeIn';

const TYPE_META: Record<Transaction['type'], { icon: string; label: string; sign: '+' | '-' | '' }> = {
  SALARY_DEPOSIT: { icon: '💵', label: 'Salary received', sign: '+' },
  ALLOCATION: { icon: '🔀', label: 'Allocated to plan', sign: '-' },
  RELEASE: { icon: '🔓', label: 'Funds unlocked', sign: '+' },
  EARLY_WITHDRAWAL: { icon: '⚡', label: 'Early withdrawal', sign: '-' },
  DEPOSIT: { icon: '📥', label: 'Deposit', sign: '+' },
};

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.transactions(50).then(setTransactions).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pb-24 max-w-2xl mx-auto px-5 pt-10">
      <h1 className="text-4xl mb-2">Activity</h1>
      <p className="text-muted mb-8">Everything that's happened with your money.</p>

      {loading && <p className="text-muted">Loading…</p>}
      {!loading && transactions.length === 0 && (
        <div className="card text-center !py-12 space-y-3">
          <div className="text-4xl">📝</div>
          <p className="text-muted">No activity yet. Once you receive a salary, history will appear here.</p>
        </div>
      )}

      <FadeIn>
        <div className="space-y-1">
          {transactions.map((t) => {
            const meta = TYPE_META[t.type] ?? { icon: '📥', label: t.type, sign: '' };
            return (
              <div key={t.id} className="card !p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-clay/40 grid place-items-center text-xl flex-shrink-0">
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{t.description ?? meta.label}</p>
                  <p className="text-muted text-xs">{formatRelative(t.createdAt)}</p>
                  {t.txHash && !t.txHash.startsWith('sim_') && (
                    <p className="text-xs text-muted/70 font-mono truncate mt-1 max-w-[200px]">
                      {t.txHash}
                    </p>
                  )}
                </div>
                <span
                  data-balance
                  className={`font-semibold mono ${meta.sign === '+' ? 'text-success' : 'text-foreground'}`}
                >
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
