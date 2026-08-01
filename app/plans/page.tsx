'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Vault } from '@/lib/api';
import { VaultCard } from '@/components/plans/VaultCard';
import { FadeIn } from '@/components/common/FadeIn';
import { Search, Plus } from 'lucide-react';

type Filter = 'ALL' | 'LOCKED' | 'RELEASED' | 'EARLY_WITHDRAWN';

export default function PlansPage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.vaults().then(setVaults).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = vaults
    .filter((v) => filter === 'ALL' || v.status === filter)
    .filter((v) => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.includes(search.toLowerCase()));

  return (
    <main className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto px-5 pt-10">
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-4xl">Plans</h1>
        <Link href="/budgets/new" className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} /> New
        </Link>
      </header>
      <p className="text-muted mb-6">Everything your salary protects, all in one place.</p>

      {/* search + filter */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input pl-11"
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['ALL', 'LOCKED', 'RELEASED', 'EARLY_WITHDRAWN'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`surface-chip whitespace-nowrap ${filter === f ? 'chip-jade' : 'bg-clay/50 text-muted'}`}
          >
            {f === 'ALL' ? 'All' : f === 'LOCKED' ? 'Locked' : f === 'RELEASED' ? 'Released' : 'Withdrawn'}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <div className="card text-center !py-12 space-y-3">
          <div className="text-4xl">🔍</div>
          <p className="text-muted">No plans match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); }} className="btn-ghost">Clear filters</button>
        </div>
      )}

      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((v) => <VaultCard key={v.id} vault={v} />)}
        </div>
      </FadeIn>
    </main>
  );
}
