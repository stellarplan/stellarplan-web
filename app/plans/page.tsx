'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Vault } from '@/lib/api';
import { VaultCard } from '@/components/plans/VaultCard';
import { FadeIn } from '@/components/common/FadeIn';
import { Search, Plus } from 'lucide-react';

type Filter = 'ALL' | 'LOCKED' | 'RELEASED' | 'EARLY_WITHDRAWN';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'LOCKED', label: 'Locked' },
  { value: 'RELEASED', label: 'Released' },
  { value: 'EARLY_WITHDRAWN', label: 'Withdrawn' },
];

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
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'var(--font-display)' }}>Plans</h1>
        <Link href="/budgets/new" id="plans-new-btn" className="btn-primary !py-2 !px-4 text-sm rounded-xl">
          <Plus size={16} /> New
        </Link>
      </div>
      <p className="mb-8 text-sm text-[#A1A1AA]">Everything your salary protects, all in one place.</p>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
        <input id="plans-search" className="input pl-11" placeholder="Search by name or category"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {FILTERS.map(({ value, label }) => (
          <button key={value} id={`filter-${value.toLowerCase()}`} onClick={() => setFilter(value)}
            className="text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200"
            style={filter === value ? {
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
            } : {
              background: '#141519',
              border: '1px solid #2B2C33',
              color: '#A1A1AA',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8 text-[#A1A1AA]">
          <div className="w-4 h-4 rounded-full border-2 animate-spin border-emerald-500/30 border-t-emerald-500" />
          <span className="text-sm">Loading vaults…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl text-center py-16 space-y-4 bg-[#141519] border border-[#2B2C33]">
          <div className="text-4xl">🔍</div>
          <p className="text-sm text-[#A1A1AA]">No plans match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); }}
            className="text-xs font-bold hover:underline text-emerald-400">
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((v) => <VaultCard key={v.id} vault={v} />)}
        </div>
      </FadeIn>
    </main>
  );
}
